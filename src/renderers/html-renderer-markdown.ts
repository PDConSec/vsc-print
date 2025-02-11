import * as vscode from 'vscode';
import * as path from "path";
import * as fs from "fs";
import { Metadata } from '../metadata';
import { ResourceProxy } from "./resource-proxy";
import { processFencedBlocks as processMarkdown } from './processMarkdown';
import { marked } from 'marked';

const resources = new Map<string, ResourceProxy>();

resources.set("default-markdown.css", new ResourceProxy(
  "text/css; charset=utf-8",
  require("../css/default-markdown.css").default.toString(),
  async f => f
));

resources.set("katex.css", new ResourceProxy(
  "text/css; charset=utf-8",
  "katex.css",
  async f => fs.promises.readFile(resourcePath(f), "utf-8")
));

resources.set("smiles-drawer.min.js", new ResourceProxy(
  "application/javascript; charset=utf-8",
  "smiles-drawer.min.js",
  async f => fs.promises.readFile(resourcePath(f), "utf-8")
));

resources.set("smiles-drawer.min.js.map", new ResourceProxy(
  "application/json; charset=utf-8",
  "smiles-drawer.min.js.map",
  async f => fs.promises.readFile(resourcePath(f), "utf-8")
));

resources.set("smartquotes.js", new ResourceProxy(
  "application/json; charset=utf-8",
  "smartquotes.js",
  async f => fs.promises.readFile(resourcePath(f), "utf-8")
));

resources.set("smartquotes.js.map", new ResourceProxy(
  "application/json; charset=utf-8",
  "smartquotes.js.map",
  async f => fs.promises.readFile(resourcePath(f), "utf-8")
));

const fontPath = resourcePath("fonts");
const fontfilenames = fs.readdirSync(fontPath);
for (const fontfilename of fontfilenames) {
  const filepath = path.join(fontPath, fontfilename);
  const fontType = path.extname(fontfilename).substring(1);
  resources.set(`fonts/${fontfilename}`,
    new ResourceProxy(
      `font/${fontType}`,
      filepath,
      async f => fs.promises.readFile(f)
    )
  );
}

// give the user the option to turn off rendered printing
export function isEnabled(): boolean {
  return vscode.workspace.getConfiguration("print").renderMarkdown;
}

export async function getBodyHtml(generatedResources: Map<string, ResourceProxy>, raw: string, languageId: string, options: any) {
  const uri: vscode.Uri = options.uri;
  const rootDocumentFolder = path.dirname(uri.fsPath);
  const updatedTokens = await processMarkdown({ LATEX: { displayMode: true } }, raw, generatedResources, rootDocumentFolder);
  let html = marked.parser(updatedTokens);
  if (vscode.workspace.getConfiguration("print").useSmartQuotes) {
    html += "<script src='bundled/smartquotes.js'></script><script>smartquotes();</script>";
  }
  return html;
}

export function getCssUriStrings(): Array<string> {
  const userSuppliedCssUrls: string[] = vscode.workspace.getConfiguration("print.stylesheets").markdown;
  const cssUriStrings = [
    "bundled/default-markdown.css",
    "bundled/katex.css",
    "bundled/colour-scheme.css",
    ...userSuppliedCssUrls,
    "bundled/settings.css"//ensure settings are always last so they take precedence
  ];
  return cssUriStrings;
}

export function getResource(name: string): ResourceProxy {
  return resources.get(name)!;
}

export function getScriptUriStrings(uri: vscode.Uri) {
  const scriptUris = [
    "bundled/smiles-drawer.min.js",
  ];
  return scriptUris;
}

function resourcePath(relativePath: string) {
  return path.join(Metadata.ExtensionPath, relativePath);
}
