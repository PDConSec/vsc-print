import * as vscode from 'vscode';
import * as path from "path";
import * as fs from "fs";
import { Metadata } from '../metadata';
import { IResourceDescriptor } from "./IResourceDescriptor";
import { processFencedBlocks as processMarkdown } from './processMarkdown';
import { marked } from 'marked';

const resources = new Map<string, IResourceDescriptor>();

resources.set("default-markdown.css", {
  content: require("../css/default-markdown.css").default.toString(),
  mimeType: "text/css; charset=utf-8"
});

resources.set("katex.css", {
  content: fs.readFileSync(resourcePath("katex.css")),
  mimeType: "text/css; charset=utf-8"
});

const fontPath = resourcePath("fonts");
const fontfilenames = fs.readdirSync(fontPath);
for (const fontfilename of fontfilenames) {
  const filepath = path.join(fontPath, fontfilename);
  const fontType = path.extname(fontfilename).substring(1);
  resources.set(`fonts/${fontfilename}`, {
    content: fs.readFileSync(filepath),
    mimeType: `font/${fontType}`
  });
}

// give the user the option to turn off rendered printing
export function isEnabled(): boolean {
  return vscode.workspace.getConfiguration("print").renderMarkdown;
}

export async function getBodyHtml(generatedResources: Map<string, IResourceDescriptor>, raw: string, languageId: string) {
  const updatedTokens = await processMarkdown({ LATEX: { displayMode: true } }, raw, generatedResources);
  return marked.parser(updatedTokens);
}

export function getCssUriStrings(): Array<string> {
  const cssUriStrings = [
    "bundled/default-markdown.css",
    "bundled/settings.css",
    "bundled/katex.css",
  ];
  return cssUriStrings;
}

export function getResource(name: string): IResourceDescriptor {
  return resources.get(name)!;
}

export function getScriptUriStrings(uri: vscode.Uri) {
  return [
  ];
}

function resourcePath(relativePath: string) {
  return path.join(Metadata.ExtensionPath, relativePath);
}
