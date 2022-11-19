import * as vscode from "vscode";

export class Metadata {
	static ExtensionPath: string = vscode.extensions.getExtension("pdconsec.vscode-print")!.extensionPath;
	static ExtensionContext: vscode.ExtensionContext;
}