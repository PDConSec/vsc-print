import * as vscode from 'vscode';

export class PrintSession {
	public editor = vscode.window.activeTextEditor;
	public selection = vscode.window.activeTextEditor?.selection;
	public uri: vscode.Uri | undefined;
	constructor(cmdArgs:vscode.Uri | undefined) {
		this.uri = cmdArgs ?? this.editor?.document.uri;
	}
}