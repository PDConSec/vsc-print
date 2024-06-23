import { escapeHtml } from "markdown-it/lib/common/utils";
import * as vscode from 'vscode';

export async function getBodyHtml(raw: string): string {
	var escaped = escapeHtml(raw);
	var escapedWithHyphenationPoints = escaped.replace(/(\w{10})/g, "$1&shy;");
	return `<pre class="plaintext">\n${escapedWithHyphenationPoints}\n</pre>`;
}

export function getCssUriStrings(uri: vscode.Uri): Array<string> {
	return [
		"bundled/default.css",
		"bundled/settings.css",
	];
}
