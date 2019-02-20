import * as vscode from 'vscode';
import * as hljs from "highlight.js";
import { readFileSync, writeFileSync } from 'fs';
import { tmpNameSync } from 'tmp';
// import * as css from "../node_modules/highlight.js/styles/ascetic.css";

export function activate(context: vscode.ExtensionContext) {
	// to avoid temp file pollution it may be necessary to switch to a pull model
	// with the handler below merely spawning either a browser with a URL 
	// as printcode does it, or my webprint service (which can request a URL)
	let disposable = vscode.commands.registerCommand('extension.print', (file) => {
		let src = readFileSync(file.fsPath).toString();
		var css = "";//require("../node_modules/highlight.js/styles/ascetic.css");
		let html = `<html><head><style>{css}</style></head><body>{hljs.highlightAuto(src).value}</body></html>`;
		let fname = tmpNameSync({ postfix: ".html" });
		let f = writeFileSync(fname, html);
		
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }