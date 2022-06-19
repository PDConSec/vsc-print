import { SourceCode } from './source-code';
import * as vscode from 'vscode';
import * as http from "http";
import * as path from "path";
import { escapePath } from './escape-path';
import * as child_process from "child_process";
import { localise } from './imports';
import * as nodeCrypto from "crypto";

const browserLaunchMap: any = { darwin: "open", linux: "xdg-open", win32: "start" };

export class PrintSession {
	static port: number;
	private created = new Date().valueOf();
	public age(): number {
		return new Date().valueOf() - this.created;
	}
	code: SourceCode | undefined;
	public ready: Promise<void>;
	public sessionId = nodeCrypto.randomUUID();
	public uri: vscode.Uri | undefined;
	constructor(cmdArgs: vscode.Uri | undefined) {
		this.ready = new Promise<void>(async (resolve, reject) => {
			try {
				const editor = vscode.window.activeTextEditor;
				let langId: string;
				if (editor) {
					const selection = editor.selection;
					const document = editor.document;
					this.uri = document.uri;
					if (selection && !selection.isEmpty) {
						this.code = new SourceCode(
							document.uri.fsPath,
							document.getText(new vscode.Range(selection.start, selection.end)).replace(/\s*$/, ""),
							document.languageId,
							selection.start.line
						);
					}
					else {
						this.code = new SourceCode(
							document.uri.fsPath,
							document.getText(),
							document.languageId
						);
					}
					langId = editor.document.languageId;
					resolve();
				} else {
					var document = await vscode.workspace.openTextDocument(cmdArgs!);
					this.uri = document.uri;
					this.code = new SourceCode(
						document.uri.fsPath,
						document.getText(),
						document.languageId
					);
					resolve();
				}
			} catch { reject(); }
		});
	}

	public async respond(urlParts: string[], response: http.ServerResponse) {
		const basePath = path.dirname(this.uri!.fsPath);
		if (urlParts.length === 2) {
			let html = this.code!.asHtml();
			response.writeHead(200, {
				"Content-Type": "text/css",
				"Content-Length": html.length
			});
			response.end(html);
		} else {
			// extract the relative path to a resource file
			const resourcePath = path.join(basePath, ...urlParts.slice(2));
			const fileUri: vscode.Uri = vscode.Uri.file(resourcePath);
			const fileExt = path.extname(resourcePath);
			switch (fileExt.toLowerCase()) {
				case "jpg":
				case "gif":
				case "png":
				case "svg":
					response.writeHead(200, {
						"Content-Type": `image/${fileExt.toLowerCase()}`,
						"Content-Length": (await vscode.workspace.fs.stat(fileUri)).size
					});
					response.end(await vscode.workspace.fs.readFile(fileUri));
					break;
				case "css":
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
		child_process.exec(`${cmd} http://localhost:${PrintSession.port}/${this.sessionId}`, (error: child_process.ExecException | null, stdout: string, stderr: string) => {
			// node on Linux incorrectly calls this error handler, with a null error object
			if (error) {
				vscode.window.showErrorMessage(`${localise("ERROR_PRINTING")}: ${error ? error.message : stderr}`);
			}
		});
	}
}
