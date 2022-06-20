import { SourceCode } from './source-code';
import * as vscode from 'vscode';
import * as http from "http";
import * as path from "path";
import { escapePath } from './escape-path';
import * as child_process from "child_process";
import { localise } from './imports';
import * as nodeCrypto from "crypto";
import { defaultCss, filenameByCaption } from "./imports";

const defaultMarkdownCss: string = require("./css/default-markdown.css").default.toString();
const lineNumbersCss: string = require("./css/line-numbers.css").default.toString();
let settingsCss: string = require("./css/settings.css").default.toString();
const colourSchemeName: string = filenameByCaption[vscode.workspace.getConfiguration("print", null).colourScheme];
const colourSchemeCss: string = require(`highlight.js/styles/${colourSchemeName}.css`).default.toString();
const browserLaunchMap: any = { darwin: "open", linux: "xdg-open", win32: "start" };

export class PrintSession {
	static port: number;
	private created = new Date().valueOf();
	public completed = false;
	public age(): number {
		return new Date().valueOf() - this.created;
	}
	code: SourceCode | undefined;
	public ready: Promise<void>;
	public sessionId = nodeCrypto.randomUUID();
	public uri: vscode.Uri | undefined;
	constructor(cmdArgs?: vscode.Uri) {
		this.ready = new Promise<void>(async (resolve, reject) => {
			try {
				const printConfig = vscode.workspace.getConfiguration("print", null);
				let printLineNumbers = printConfig.lineNumbers === "on";
				if (cmdArgs) {
					const uristat = await vscode.workspace.fs.stat(cmdArgs);
					if (uristat.type === vscode.FileType.Directory) {
						this.code = new SourceCode(cmdArgs.fsPath, "", "folder", printLineNumbers)
					} else {
						var document = await vscode.workspace.openTextDocument(cmdArgs);
						this.uri = document.uri;
						this.code = new SourceCode(
							document.uri.fsPath,
							document.getText(),
							document.languageId,
							printLineNumbers
						);
					}
					resolve();
				}
				else {
					const editor = vscode.window.activeTextEditor;
					printLineNumbers = printLineNumbers || printConfig.lineNumbers === "inherit" && (editor?.options.lineNumbers ?? 0) > 0;
					if (editor) {
						const selection = editor.selection;
						const document = editor.document;
						this.uri = document.uri;
						if (selection && !selection.isEmpty) {
							this.code = new SourceCode(
								document.uri.fsPath,
								document.getText(new vscode.Range(selection.start, selection.end)).replace(/\s*$/, ""),
								document.languageId,
								printLineNumbers,
								selection.start.line
							);
						}
						else {
							this.code = new SourceCode(
								document.uri.fsPath,
								document.getText(),
								document.languageId,
								printLineNumbers
							);
						}
						resolve();
					}
				}
			} catch { reject(); }
		});
	}

	public async respond(urlParts: string[], response: http.ServerResponse) {
		if (urlParts.length === 3 && urlParts[2] === "") {
			let html = await this.code!.asHtml();
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8",
				"Content-Length": Buffer.byteLength(html, 'utf-8')
			});
			response.end(html);
		} else if (urlParts.length === 3 && urlParts[2] === "completed") {
			this.completed = true;
			response.writeHead(200, {
				"Content-Type": "text/plain; charset=utf-8",
				"Content-Length": 2
			});
			response.end("OK");
		} else if (urlParts.length === 4 && urlParts[2] === "vsc-print.resource") {
			switch (urlParts[3]) {
				case "colour-scheme.css":
					response.writeHead(200, {
						"Content-Type": "text/css; charset=utf-8",
						"Content-Length": colourSchemeCss.length
					});
					response.end(colourSchemeCss);
					break;
				case "default.css":
					response.writeHead(200, {
						"Content-Type": "text/css; charset=utf-8",
						"Content-Length": Buffer.byteLength(defaultCss, 'utf-8')
					});
					response.end(defaultCss);
					break;
				case "default-markdown.css":
					response.writeHead(200, {
						"Content-Type": "text/css; charset=utf-8",
						"Content-Length": Buffer.byteLength(defaultMarkdownCss, 'utf-8')
					});
					response.end(defaultMarkdownCss);
					break;
				case "line-numbers.css":
					response.writeHead(200, {
						"Content-Type": "text/css; charset=utf-8",
						"Content-Length": Buffer.byteLength(lineNumbersCss, "utf-8")
					});
					response.end(lineNumbersCss);
					break;
				case "settings.css":
					let css = settingsCss;
					// todo apply settings to template
					response.writeHead(200, {
						"Content-Type": "text/css; charset=utf-8",
						"Content-Length": Buffer.byteLength(css, "utf-8")
					});
					response.end(css);
					break;
				default:
					response.writeHead(404, {
						"Content-Type": "text/plain; charset=utf-8",
						"Content-Length": 9
					});
					response.end("Not found");
					break;
			}
		} else {
			// extract the relative path to a resource file
			const basePath = path.dirname(this.uri!.fsPath);
			const resourcePath = path.join(basePath, ...urlParts.slice(2));
			const fileUri: vscode.Uri = vscode.Uri.file(resourcePath);
			const fileExt = path.extname(resourcePath);
			switch (fileExt.toLowerCase()) {
				case ".jpg":
				case ".gif":
				case ".png":
				case ".svg":
					response.writeHead(200, {
						"Content-Type": `image/${fileExt.toLowerCase()}`,
						"Content-Length": (await vscode.workspace.fs.stat(fileUri)).size
					});
					response.end(await vscode.workspace.fs.readFile(fileUri));
					break;
				case ".css":
					response.writeHead(200, {
						"Content-Type": "text/css",
						"Content-Length": (await vscode.workspace.fs.stat(fileUri)).size
					});
					response.end(await vscode.workspace.fs.readFile(fileUri));
					break;
				default:
					response.writeHead(403, {
						"Content-Type": "text/plain",
						"Content-Length": 9
					});
					response.end("Forbidden");
					break;
			}
		}
	}

	async launchBrowser() {
		let printConfig = vscode.workspace.getConfiguration("print", null);
		let cmd = printConfig.alternateBrowser && printConfig.browserPath ? escapePath(printConfig.browserPath) : browserLaunchMap[process.platform];
		child_process.exec(`${cmd} http://localhost:${PrintSession.port}/${this.sessionId}/`, (error: child_process.ExecException | null, stdout: string, stderr: string) => {
			// node on Linux incorrectly calls this error handler, with a null error object
			if (error) {
				vscode.window.showErrorMessage(`${localise("ERROR_PRINTING")}: ${error ? error.message : stderr}`);
			}
		});
	}
}
