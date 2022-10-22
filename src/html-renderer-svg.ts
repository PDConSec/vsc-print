// SVG is the simplest possible case.
// - used as-is in HTML
// - no stylesheets
// - no resources

// NB We ignore potential bitmap resource
// dependencies for the sake of a simple demo

import * as vscode from 'vscode';

export function getBodyHtml(raw: string) {
	return raw;
}

export function getCssUriArray(): Array<vscode.Uri> {
	return [];
}

export function getTitle(uri: vscode.Uri) {
	return uri.path;
}

export function getResource(uri: vscode.Uri): Buffer | string {
	throw "ERR_NOTIMPL";
}