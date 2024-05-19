import { escapeHtml } from "markdown-it/lib/common/utils";

export function getBodyHtml(raw: string): string {
	return `<pre class="plaintext">\n${escapeHtml(raw)}\n</pre>`;
}
