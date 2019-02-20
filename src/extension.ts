import * as vscode from 'vscode';
import * as hljs from "highlight.js";
import { readFileSync, writeFileSync, readFile } from 'fs';
import { tmpNameSync } from 'tmp';
// import * as css from "../node_modules/highlight.js/styles/ascetic.css";

export function activate(context: vscode.ExtensionContext) {
	// to avoid temp file pollution it may be necessary to switch to a pull model
	// with the handler below merely spawning either a browser with a URL 
	// as printcode does it, or my webprint service (which can request a URL)
	let disposable = vscode.commands.registerCommand('extension.print', (file) => {
		readFile(file.fsPath, (err, data) => {
			var src = data.toString();
			let x = vscode.extensions.getExtension("pdconsec.print");
			if (x) {
				var stylePath = `${x.extensionPath}/node_modules/highlight.js/styles`;
				readFile(`${stylePath}/default.css`, (err, data) => {
					var defaultCss = data.toString();
					readFile(`${stylePath}/ascetic.css`, (err, data) => {
						var swatchCss = data.toString();
						let html = `<html><head><style>${defaultCss}\r${swatchCss}</style></head><body><pre><code>${hljs.highlightAuto(src).value}</code></pre></body></html>`;
						let fname = tmpNameSync({ postfix: ".html" });
						let f = writeFileSync(fname, html);
						console.log(fname);
					});
				});
			}
		});
		// let html = `<html><head><link rel="stylesheet" type="text/css" href="K:\extension-1\vsc-print\node_modules\highlight.js\styles\default.css"><link rel="stylesheet" type="text/css" href="K:\extension-1\vsc-print\node_modules\highlight.js\styles\ascetic.css"></head><body><pre><code>${hljs.highlightAuto(src).value}</code></pre></body></html>`;
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }