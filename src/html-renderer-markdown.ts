import * as vscode from 'vscode';
import { logger } from './logger';
import { HtmlDocumentBuilder } from './html-document-builder';
import { IResourceDescriptor } from './IResourceDescriptor';

const resources = new Map<string, IResourceDescriptor>();
resources.set("default-markdown.css", {
	content: require("./css/default-markdown.css").default.toString(),
	mimeType: "text/css; charset=utf-8;"
});

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

export function getResource(name: string): IResourceDescriptor {
	return resources.get(name)!;
}

export function isEnabled(): boolean {
	return vscode.workspace.getConfiguration("print").renderMarkdown;
}
