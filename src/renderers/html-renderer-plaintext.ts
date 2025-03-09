import * as vscode from 'vscode';
import { ResourceProxy } from "./resource-proxy";

export async function getBodyHtml(_: Map<string, ResourceProxy>, raw: string): Promise<string> {
  return `<pre class="plaintext">\n${escapeHtml(raw)}\n</pre>`;
}

export function getCssUriStrings(uri: vscode.Uri): Array<string> {
  const plaintextConfig = vscode.workspace.getConfiguration("print.plaintext");
  const userSuppliedCssUrls: string[] = plaintextConfig.get("stylesheets") ?? [];
  return [
    "bundled/default.css",
    ...userSuppliedCssUrls,
    "bundled/settings.css",
  ];
}

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
