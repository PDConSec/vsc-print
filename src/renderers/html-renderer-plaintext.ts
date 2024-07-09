import { escapeHtml } from "markdown-it/lib/common/utils";
import * as vscode from 'vscode';
import { ResourceProxy } from "./resource-proxy";

export async function getBodyHtml(_: Map<string, ResourceProxy>, raw: string): Promise<string> {
  return `<pre class="plaintext">\n${escapeHtml(raw)}\n</pre>`;
}

export function getCssUriStrings(uri: vscode.Uri): Array<string> {
  const userSuppliedCssUrls: string[] = vscode.workspace.getConfiguration("print.stylesheets").plaintext;
  return [
    "bundled/default.css",
    ...userSuppliedCssUrls,
    "bundled/settings.css",
  ];
}
