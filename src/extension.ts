import * as vscode from 'vscode';
import * as hljs from "highlight.js";
import { readFileSync, createReadStream } from 'fs';
import * as http from "http";
import * as child_process from "child_process";

export function activate(context: vscode.ExtensionContext) {
	printConfig = vscode.workspace.getConfiguration("print", null);
	let disposable = vscode.commands.registerCommand('extension.print', cmdArgs => {
		commandArgs = cmdArgs;
		startWebserver();
		child_process.exec(`${printConfig.browserPath || browserMap[process.platform]} http://localhost:${printConfig.port}/`);
	});
	context.subscriptions.push(disposable);
}

var commandArgs: any;
var printConfig: vscode.WorkspaceConfiguration;

const browserMap: any = {
	darwin: "open",
	linux: "xdg-open",
	win32: "start"
};

function getFileText(fname: string): string {
	var text = readFileSync(fname).toString();
	//strip BOM when present
	return text.indexOf('\uFEFF') === 0 ? text.substring(1, text.length) : text;
}

function getSourceCode(): string {
	try {
		var lines = getFileText(commandArgs.fsPath).split("\n");
		var text = "";
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			text += `${i} ${line}`;
		}
		return text;
		//return getFileText(commandArgs.fsPath);
	} catch (error) {
		if (vscode.window.activeTextEditor) {
			return vscode.window.activeTextEditor.document.getText();
		} else {
			throw new Error("Cannot access the specified file and there is no active editor");
		}
	}
}

function getRenderedSourceCode(): string {
	let x = vscode.extensions.getExtension("pdconsec.print");
	if (!x) { throw new Error("Cannot resolve extension. Has the name changed?"); }
	let stylePath = `${x.extensionPath}/node_modules/highlight.js/styles`;
	let defaultCss = getFileText(`${stylePath}/default.css`);
	let swatchCss = getFileText(`${stylePath}/kimbie.light.css`);
	let renderedCode = hljs.highlightAuto(getSourceCode()).value;
	return `<html><head><style>${defaultCss}\r${swatchCss}</style></head><body style="font-family: Consolas, monospace;font-size:${printConfig.fontSize};" onload="window.print();window.close();"><pre><code>${renderedCode}</code></pre></body></html>`;
}

var server: http.Server | undefined;
var port: number = 5050;

function startWebserver(): Promise<void> {
	return new Promise((resolve, reject) => {
		// clean up unexpected stragglers
		if (server !== undefined && printConfig.port !== port) {
			server.close(() => { });
			server = undefined;
		}
		if (server === undefined) {
			// prepare to service an http request
			server = http.createServer((request, response) => {
				if (request.url) {
					let html = getRenderedSourceCode();
					//response.setHeader("Content-Type", "text/html");
					response.end(html);
				}
			});
			// report exceptions
			server.on("error", (err: any) => {
				if (err) {
					switch (err.code) {
						case "EADDRINUSE":
							vscode.window.showInformationMessage(`PORT ${printConfig.port} OCCUPIED. CHANGE WEBSERVER CONFIG.`);
							break;
						case "EACCES":
							vscode.window.showInformationMessage("ACCESS DENIED ESTABLISHING WEBSERVER");
							break;
					}
					if (server) {
						server.close();
						server = undefined;
						port = 0;
					}
					reject();
				}
			});
			// clean up after one request
			server.on("request", (request: any, response: any) => {
				response.on("finish", () => {
					request.socket.destroy();
				});
			});
			server.listen(printConfig.port);
		}
		resolve();
	});
}

export function deactivate() { }