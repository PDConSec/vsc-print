import * as vscode from 'vscode';
import { logger } from '../logger';
import { HtmlDocumentBuilder } from './html-document-builder';
import { IResourceDescriptor } from './IResourceDescriptor';

const resources = new Map<string, IResourceDescriptor>();
resources.set("default-markdown.css", {
	content: require("../css/default-markdown.css").default.toString(),
	mimeType: "text/css; charset=utf-8;"
});

export async function getBodyHtml(raw: string): string {
	let renderedCode = "";
	try {
		renderedCode = HtmlDocumentBuilder.MarkdownEngine.render(raw);
		const startOffset = renderedCode.indexOf('<style id="mmd-vscode-style">');
		const endOffset = renderedCode.indexOf("</style>", startOffset);
		if (startOffset !== -1) {
			const mmdVscodeStyle = renderedCode.substring(startOffset, endOffset);
			renderedCode = renderedCode.replace(mmdVscodeStyle, "");
			// todo keep the styling, support delivering it as a linked stylesheet and add an option to do so
		}
	} catch {
		logger.error("Markdown could not be rendered");
		renderedCode = "<div>Could not render this file.</end>";
	}
	return renderedCode;
}

export function getCssUriStrings(uri: vscode.Uri): Array<string> {
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
