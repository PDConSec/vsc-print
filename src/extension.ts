import * as vscode from 'vscode';
import * as hljs from "highlight.js";
import { readFileSync, writeFileSync } from 'fs';
import * as http from "http";
import * as child_process from "child_process";
import * as fs from "fs";
import portfinder = require("portfinder");
import * as nls from 'vscode-nls';

const localize = nls.config({ messageFormat: nls.MessageFormat.file })();
var md: any;
var commandArgs: any;
var selection: vscode.Selection | undefined;
const browserLaunchMap: any = { darwin: "open", linux: "xdg-open", win32: "start" };
export function activate(context: vscode.ExtensionContext) {
	let ecmPrint = vscode.workspace.getConfiguration("print", null).editorContextMenuItemPosition;
	vscode.commands.executeCommand("setContext", "ecmPrint", ecmPrint);
	let disposable = vscode.commands.registerCommand("extension.print", async (cmdArgs: any) => {
		commandArgs = cmdArgs;
		let editor = vscode.window.activeTextEditor;
		selection = editor && editor.selection ? editor.selection : undefined;
		await startWebserver();
		let printConfig = vscode.workspace.getConfiguration("print", null);
		let cmd = printConfig.alternateBrowser && printConfig.browserPath ? `"${printConfig.browserPath}"` : browserLaunchMap[process.platform];
		child_process.exec(`${cmd} http://localhost:${port}/`);
	});
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('extension.browse', async (cmdArgs: any) => {
		commandArgs = cmdArgs;
		let x = vscode.extensions.getExtension("pdconsec.vscode-print");
		if (!x) { throw new Error("Cannot resolve extension. Has the name changed? It is defined by the publisher and the extension name defined in package.json"); }
		var styleCachePath = `${x.extensionPath.replace(/\\/g, "/")}/node_modules/highlight.js/styles`;
		let printConfig = vscode.workspace.getConfiguration("print", null);
		let currentPath = `${styleCachePath}/${printConfig.colourScheme}.css`;
		vscode.window.showOpenDialog({
			canSelectFiles: true,
			canSelectMany: false,
			defaultUri: vscode.Uri.file(fs.existsSync(currentPath) ? currentPath : styleCachePath),
			filters: {
				Stylesheet: ['css']
			}
		}).then(f => {
			if (f) {
				let p = f[0].fsPath.replace(/\\/g, "/");
				let lastSlashPosition = p.lastIndexOf("/");
				let extensionSeparatorPosition = p.lastIndexOf(".");
				if (extensionSeparatorPosition === -1) {
					extensionSeparatorPosition = p.length;
				}
				var path = p.substring(0, lastSlashPosition);
				var fileName = p.substring(lastSlashPosition + 1, extensionSeparatorPosition);
				try {
					vscode.workspace.getConfiguration().update("print.colourScheme", fileName, vscode.ConfigurationTarget.Global).then(() => {
						if (path !== styleCachePath) {
							let newCachePath = `${styleCachePath}/${fileName}`;
							fs.copyFile(p, newCachePath, err => {
								vscode.window.showErrorMessage(err.message);
							});
						}
					}, (err) => {
						debugger;
					});
				} catch (err) {
					debugger;
				}
			}
		});
	});
	context.subscriptions.push(disposable);
	return { extendMarkdownIt(mdparam: any) { return md = mdparam; } };
}

async function getPort(): Promise<number> {
	let printConfig = vscode.workspace.getConfiguration("print", null);
	portfinder.basePort = printConfig.dynamicPortMin;
	return portfinder.getPortPromise({
		startPort: printConfig.dynamicPortMin,
		stopPort: printConfig.dynamicPortMax
	});
}

function getFileText(fname: string): string {
	// vscode.window.showInformationMessage(`vsc-print get ${fname}`);

	var text = readFileSync(fname).toString();
	// strip BOM when present
	// vscode.window.showInformationMessage(`vsc-print got ${fname}`);
	return text.indexOf('\uFEFF') === 0 ? text.substring(1, text.length) : text;
}

async function getSourceCode(): Promise<string[]> {

	let sender = "NOT SET";
	const commandArgsFsPath = commandArgs ? commandArgs.fsPath : undefined;
	let editorFsPath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri.fsPath : undefined;

	sender = editorFsPath === commandArgsFsPath ? "ACTIVE TEXT EDITOR" : "FILE EXPLORER";
	if (!commandArgs) {
		commandArgs = { fsPath: commandArgsFsPath || editorFsPath };
	}
	let result = [];
	switch (sender) {
		case "ACTIVE TEXT EDITOR":
			if (vscode.window.activeTextEditor) {
				result.push(vscode.window.activeTextEditor.document.languageId);
				result.push(selection && !(selection.isEmpty || selection.isSingleLine) ?
					vscode.window.activeTextEditor.document.getText(new vscode.Range(selection.start, selection.end)).replace(/\s*$/, "") :
					vscode.window.activeTextEditor.document.getText());
			}
			break;
		case "FILE EXPLORER":
			try {
				let otd = await vscode.workspace.openTextDocument(commandArgs.fsPath);
				result.push(otd.languageId);
				result.push(otd.getText());
			} catch (error) {
				throw new Error(`Cannot access ${commandArgsFsPath}.\n${error.Message}`);
			}
			break;
	}
	return result;
}

const lineNumberCss = `
/* Line numbers */

table {
  border: none;
  border-collapse: collapse;
}
.line-number {
  border-right: thin solid silver;
  padding-right: 0.3em;
  text-align: right;
  vertical-align: top;
}
.line-text {
  margin-left: 0.7em;
  padding-bottom: {lineSpacing}em;
  white-space: pre-wrap;
}
`;

async function getRenderedSourceCode(): Promise<string> {
	let printConfig = vscode.workspace.getConfiguration("print", null);
	let printAndClose = printConfig.printAndClose ? " onload = \"window.print();window.close();\"" : "";
	let fsPath: string;
	fsPath = "NOT SET";
	if (commandArgs) {
		fsPath = commandArgs.fsPath;
	}
	else if (vscode.window.activeTextEditor) {
		fsPath = vscode.window.activeTextEditor.document.uri.fsPath;
	}
	if (printConfig.renderMarkdown && fsPath.toLowerCase().split('.').pop() === "md") {
		let markdownConfig = vscode.workspace.getConfiguration("markdown", null);
		let raw = fs.readFileSync(fsPath).toString();
		let content = md.render(raw);
		try {
			content = content.replace(/vscode-resource:\/([A-Za-z]):/g, "$1COLON");
			content = content.replace(/vscode-resource:/g, "");

		} catch (error) {
			debugger;
		}
		let result = `<!DOCTYPE html><html><head><title>${fsPath}</title>
    <meta charset="utf-8"/>
    <style>
    html, body {
      font-family: ${markdownConfig.preview.fontFamily};
      font-size: ${markdownConfig.preview.fontSize}px;
      line-height: ${markdownConfig.preview.lineHeight}em;
    }
    img {
      max-width: 100%;
    }
    h1,h2,h3,h4,h5,h6 {
      page-break-after:avoid;
      page-break-inside:avoid;
    }
    </style>
    ${markdownConfig.styles.map((cssFilename: string) => `<link href="${cssFilename}" rel="stylesheet" />`).join("\n")}
    </head>
		<body${printAndClose}>${content}</body></html>`;
		return result;
	}
	let x = vscode.extensions.getExtension("pdconsec.vscode-print");
	if (!x) { throw new Error("Cannot resolve extension. Has the name changed? It is defined by the publisher and the extension name defined in package.json"); }
	let stylePath = `${x.extensionPath}/node_modules/highlight.js/styles`;
	let defaultCss = getFileText(`${stylePath}/default.css`);
	let swatchCss = getFileText(`${stylePath}/${printConfig.colourScheme}.css`);
	let sourceCode = await getSourceCode();
	let renderedCode = "";
	try {
		renderedCode = hljs.highlight(sourceCode[0], sourceCode[1]).value;
	}
	catch (err) {
		renderedCode = hljs.highlightAuto(sourceCode[1]).value;
	}
	var addLineNumbers = printConfig.lineNumbers === "on" || (printConfig.lineNumbers === "inherit" && vscode.window.activeTextEditor && (vscode.window.activeTextEditor.options.lineNumbers || 0) > 0);
	if (addLineNumbers) {
		var startLine = selection && !(selection.isEmpty || selection.isSingleLine) ? selection.start.line + 1 : 1;
		renderedCode = renderedCode
			.split("\n")
			.map((line, i) => `<tr><td class="line-number">${startLine + i}</td><td class="line-text">${line}</td></tr>`)
			.join("\n")
			.replace("\n</td>", "</td>")
			;
	} else {
		renderedCode = renderedCode
			.split("\n")
			.map((line, i) => `<tr><td class="line-text">${line}</td></tr>`)
			.join("\n")
			.replace("\n</td>", "</td>")
			;
	}
	let editorConfig = vscode.workspace.getConfiguration("editor", null);
	let html = `<html><head><title>${fsPath}</title><meta charset="utf-8"/><style>body{margin:0;padding:0;tab-size:${editorConfig.tabSize}}\n${defaultCss}\r${swatchCss}\n${lineNumberCss.replace("{lineSpacing}", (printConfig.lineSpacing - 1).toString())}\n.hljs { max-width:100%; width:100%; font-family: Consolas, monospace; font-size: ${printConfig.fontSize}; }\n</style></head><body${printAndClose}><table class="hljs">${renderedCode}</table></body></html>`;
	return html;
}

var server: http.Server | undefined;
var port: number;

function startWebserver(): Promise<void> {
	return new Promise(async (resolve, reject) => {
		// clean up unexpected stragglers
		if (server) {
			server.close();
			server = undefined;
		}
		if (!server) {
			// prepare to service an http request
			server = http.createServer(async (request, response) => {
				try {
					if (request.url) {
						if (request.url === "/") {
							response.setHeader("Content-Type", "text/html");
							response.end(await getRenderedSourceCode());
						} else {
							let filePath: string = request.url.substr(1).replace(/COLON)/g, ":");
							let cb = fs.statSync(filePath).size;
							let lastdotpos = request.url.lastIndexOf('.');
							let fileExt = request.url.substr(lastdotpos + 1);
							response.setHeader("Content-Type", `image/${fileExt}`);
							response.setHeader("Content-Length", cb);
							fs.createReadStream(filePath).pipe(response);
						}
					}
				} catch (error) {
					response.setHeader("Content-Type", "text/plain");
					//let errorPage = `<pre>${error.stack}</pre>`;
					response.end(error.stack);
				}
			});
			// report exceptions
			server.on("error", (err: any) => {
				if (err) {
					switch (err.code) {
						case "EACCES":
							vscode.window.showErrorMessage("ACCESS DENIED ESTABLISHING WEBSERVER");
							break;
						default:
							vscode.window.showErrorMessage(`UNEXPECTED ERROR: ${err.code}`);
					}
				}
			});
			// clean up after one request
			server.on("request", (request: any, response: any) => {
				response.on("finish", () => request.socket.destroy());
			});
			let printConfig = vscode.workspace.getConfiguration("print", null);
			if (!port) {
				port = await getPort();
				if (printConfig.announcePortAcquisition) {
					vscode.window.showInformationMessage(`Printing acquired port ${port}`);
				}
			}
			server.listen(port);
			resolve();
		}
		resolve();
	});
}

export function deactivate() { }