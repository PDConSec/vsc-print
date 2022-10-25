import * as vscode from 'vscode';
import { logger } from './logger';
import hljs = require('highlight.js');

export function getBodyHtml(raw: string, languageId: string): string {
	let renderedCode = "";
	return renderedCode;
}

export function getCssUriStrings(): Array<string> {
	return [
		"vsc-print.resource/default.css",
		"vsc-print.resource/line-numbers.css",
		"vsc-print.resource/colour-scheme.css",
		"vsc-print.resource/settings.css",
	];
}

function getEmbeddedStyles() {
	let editorConfig = vscode.workspace.getConfiguration("editor");
	return `body{tab-size:${editorConfig.tabSize};}`;
}


