import * as vscode from 'vscode';
import { logger } from './logger';
import { HtmlDocumentBuilder } from './html-document-builder';

export function getBodyHtml(raw: string): string {
	let renderedCode = "";
	try {
		renderedCode = HtmlDocumentBuilder.MarkdownEngine.render(raw);
		const v = renderedCode.lastIndexOf("</style>");
		if (v != -1) {
			renderedCode = renderedCode.substring(v + 8);
		}
	} catch {
		logger.error("Markdown could not be rendered");
		renderedCode = "<div>Could not render this file.</end>";
	}
	return renderedCode;
}

export function getCssUriStrings(): Array<string> {
	const markdownConfig = vscode.workspace.getConfiguration("markdown");
	return [
		"bundled/default-markdown.css",
		...markdownConfig.styles
	];
}

export function isEnabled(): boolean {
	return vscode.workspace.getConfiguration("print").renderMarkdown;
}
