import * as vscode from 'vscode';
import "../node_modules/highlightjs/highlight.pack.js";
import * as hljs from 'highlight.js';

export function activate(context: vscode.ExtensionContext) {
	console.log('VSC-PRINT ACTIVATED');
	let disposable = vscode.commands.registerCommand('extension.print', () => {
		// TODO IMPLEMENTATION
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let language = editor.document.languageId;
			let text = editor.document.getText();
			let html = hljs.highlightAuto(text);
	}
		vscode.window.showInformationMessage('Hello VS Code!');
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }