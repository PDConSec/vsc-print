import * as vscode from 'vscode';

export function getBodyHtml(raw: string) {
	//
}

export function getCssUriArray(): Array<vscode.Uri> {
	return [];
}

export function getTitle(uri: vscode.Uri) {
	return uri.path;
}

export function getResource(uri: vscode.Uri): Buffer | string {
	return "";
}