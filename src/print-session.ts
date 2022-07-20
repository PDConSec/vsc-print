import { HtmlRenderer } from './html-renderer';
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
	htmlRenderer: HtmlRenderer | undefined;
	public ready: Promise<void>;
	public sessionId = nodeCrypto.randomUUID();
	public uri: vscode.Uri | undefined;
	constructor(cmdArgs?: vscode.Uri) {
		this.ready = new Promise(async (resolve, reject) => {
			try {
				const printConfig = vscode.workspace.getConfiguration("print", null);
				const editor = vscode.window.activeTextEditor;
				let document = editor?.document;
				let printLineNumbers = printConfig.lineNumbers === "on";
				const contentSource = await this.contentSource(cmdArgs);
				switch (contentSource) {
					case "editor": {
						printLineNumbers = printLineNumbers || printConfig.lineNumbers === "inherit" && (editor?.options.lineNumbers ?? 0) > 0;
						if (!document) throw "This can't happen";
						this.htmlRenderer = new HtmlRenderer(
							document.uri.fsPath,
							document.getText(),
							document.languageId,
							printLineNumbers
						);
					}
						break;
					case "selection": {
						printLineNumbers = printLineNumbers || printConfig.lineNumbers === "inherit" && (editor?.options.lineNumbers ?? 0) > 0;
						if (!document) throw "This can't happen";
						const selection = editor?.selection;
						if (!selection) throw "This can't happen";
						this.uri = document.uri;
						if (selection.isEmpty) {
							const selectedText = document!.getText(new vscode.Range(selection.start, selection.end)).replace(/\s*$/, "");
							const langId = document!.languageId;
							const startLine = selection.start.line + 1; // zero based to one based
							this.htmlRenderer = new HtmlRenderer(
								document.uri.fsPath,
								selectedText,
								langId,
								printLineNumbers,
								startLine
							);
						}
					}
						break;
					case "file":
						document = await vscode.workspace.openTextDocument(cmdArgs!);
						this.uri = document.uri;
						this.htmlRenderer = new HtmlRenderer(
							document.uri.fsPath,
							document.getText(),
							document.languageId,
							printLineNumbers
						);
						break;
					case "folder":
						this.htmlRenderer = new HtmlRenderer(cmdArgs!.fsPath, "", "folder", printLineNumbers)
						break;
				}
				this.launchBrowser()
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public async respond(urlParts: string[], response: http.ServerResponse) {
		await this.ready;
		
		if (urlParts.length === 3 && urlParts[2] === "") {
			const renderer = this.htmlRenderer;
			const html = await renderer!.asHtml();
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
		} else if (urlParts.length === 4 && urlParts[2] === "workspace.resource") {
			const basePath = vscode.workspace.getWorkspaceFolder(this.uri!)?.uri.fsPath!;
			const resourcePath = path.join(basePath, ...urlParts.slice(3));
			await relativeResource(resourcePath);
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
					const printConfig = vscode.workspace.getConfiguration("print", null);
					const css = settingsCss
						.replace("$FONT_SIZE", printConfig.fontSize)
						.replace("$LINE_SPACING", printConfig.lineSpacing)
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
			const basePath = path.dirname(this.uri!.fsPath);
			const resourcePath = path.join(basePath, ...urlParts.slice(2));
			await relativeResource(resourcePath);
		}

		async function relativeResource(resourcePath: string) {
			const fileUri: vscode.Uri = vscode.Uri.file(resourcePath);
			const fileExt = path.extname(resourcePath);
			switch (fileExt.toLowerCase()) {
				case ".jpg":
				case ".gif":
				case ".png":
				case ".svg":
					response.writeHead(200, {
						"Content-Type": `image/${fileExt.substring(1).toLowerCase()}`,
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

	public getUrl(): string { return `http://localhost:${PrintSession.port}/${this.sessionId}/`; }
	public static getLaunchBrowserCommand(): string {
		const printConfig = vscode.workspace.getConfiguration("print", null);
		const cmd = printConfig.alternateBrowser && printConfig.browserPath ? escapePath(printConfig.browserPath) : browserLaunchMap[process.platform];
		return cmd;
	}

	public async launchBrowser(): Promise<string> {
		const url = this.getUrl();
		const testFlags = await vscode.commands.executeCommand("extension.test.flags") as Set<string>;
		if (!testFlags.has("suppress browser")) {
			const cmd = PrintSession.getLaunchBrowserCommand();
			child_process.exec(`${cmd} ${url}`, (error: child_process.ExecException | null, stdout: string, stderr: string) => {
				// node on Linux incorrectly calls this error handler, with a null error object
				if (error) {
					vscode.window.showErrorMessage(`${localise("ERROR_PRINTING")}: ${error ? error.message : stderr}`);
				}
			});
		}
		return url;
	}

	async contentSource(uri?: vscode.Uri): Promise<string> {
		if (!uri) return "editor"; // unsaved
		try {
			const uristat = await vscode.workspace.fs.stat(uri);
			if (uristat.type === vscode.FileType.Directory) return "folder";
			const editor = vscode.window.activeTextEditor;
			if (editor && uri.toString() === editor.document.uri.toString()) {
				return !editor.selection || editor.selection.isEmpty || editor.selection.isSingleLine ? "editor" : "selection";
			} else {
				return "file";
			}			
		} catch (error) {
			console.log(`Unexpected error analysing contentSource, uri was ${typeof uri === "undefined" ? "undefined" : JSON.stringify(uri)}`);
			throw error;
		}
	}
}

