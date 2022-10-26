import * as vscode from 'vscode';

export function isEnabled(): boolean {
	return vscode.workspace.getConfiguration("print").renderSvg;
}

export function getBodyHtml(raw: string, languageId: string) {
	return raw
		.substring(raw.indexOf("<svg"));
		// .replace(/(<svg .*) height *= *"[^"]*"(.*>)/gi, "$1$2")
		// .replace(/(<svg .*) width *= *"[^"]*"(.*>)/gi, "$1$2");
}

// demo only, not actually specified by registration
// default behaviour is more appropriate (shortened filepath)
export function getTitle(filepath: string) {
	return "SVG custom title";
}

