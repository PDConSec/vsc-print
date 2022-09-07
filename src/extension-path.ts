import * as vscode from 'vscode';
let x = vscode.extensions.getExtension("pdconsec.vscode-print")!;
export const extensionPath = x.extensionPath.replace(/\\/g, "/");
