import * as vscode from 'vscode';
import * as path from "path";
import * as fs from "fs";
import { Metadata } from '../metadata';
import { IResourceDescriptor } from "./IResourceDescriptor";
import { processFencedBlocks } from './processFencedBlocks';
import { marked } from 'marked';
import resources from './resources';

// RESOURCES 
//onst resources = new Map<string, IResourceDescriptor>();

// Resolve the content of a stylesheet.
// Then add it to resources with the CSS mimeType
// under the name that will be used to request it.
resources.set("default-markdown.css", {
  content: require("../css/default-markdown.css").default.toString(),
  mimeType: "text/css; charset=utf-8;"
});

resources.set("katex.css", {
  content: require("../../node_modules/katex/dist/katex.css").default.toString(),
  mimeType: "text/css; charset=utf-8;"
});

let mermaidPath = path.join(Metadata.ExtensionPath, "mermaid.min.js");
if (!fs.existsSync(mermaidPath)) {
  mermaidPath = path.join(Metadata.ExtensionPath, "dist", "mermaid.min.js");
}
const mermaidContent = fs.readFileSync(mermaidPath);
resources.set("mermaid.min.js", {
  content: mermaidContent,
  mimeType: "text/javascript"
});

// give the user the option to turn off rendered printing
export function isEnabled(): boolean {
  return vscode.workspace.getConfiguration("print").renderMarkdown;
}

export async function getBodyHtml(generatedResources: Map<string, IResourceDescriptor>, raw: string, languageId: string) {
  generatedResources.clear();
  const updatedTokens = await processFencedBlocks({}, raw, generatedResources);
  return marked.parser(updatedTokens);
}

export function getCssUriStrings(): Array<string> {
  const cssUriStrings = [
    "bundled/default-markdown.css",
    "bundled/katex.css",
    "bundled/settings.css"
  ];
  return cssUriStrings;
}

export function getResource(name: string): IResourceDescriptor {
  return resources.get(name)!;
}

export function getScriptUriStrings(uri: vscode.Uri) {
  return [
    "bundled/mermaid.min.js"
  ]
}

