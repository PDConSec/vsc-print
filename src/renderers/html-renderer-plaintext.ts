import { escapeHtml } from "markdown-it/lib/common/utils";
import * as vscode from 'vscode';
import { IResourceDescriptor } from "./IResourceDescriptor";

export async function getBodyHtml(generatedResources: Map<string, IResourceDescriptor>, raw: string): Promise<string> {
	return `<pre class="plaintext">\n${escapeHtml(raw)}\n</pre>`;
}

export function getCssUriStrings(uri: vscode.Uri): Array<string> {
	return [
		"bundled/default.css",
		"bundled/settings.css",
	];
}
