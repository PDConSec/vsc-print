import * as vscode from 'vscode';
import * as path from "path";
import * as fs from "fs";
import { Metadata } from '../metadata';
import { ResourceProxy } from "./resource-proxy";
import { processFencedBlocks as processMarkdown } from './processMarkdown';
import { marked } from 'marked';

const resources = new Map<string, ResourceProxy>();

// resources.set("default-markdown.css", {
//   content: require("../css/default-markdown.css").default.toString(),
//   mimeType: "text/css; charset=utf-8"
// });

// resources.set("katex.css", {
//   content: fs.readFileSync(resourcePath("katex.css")),
//   mimeType: "text/css; charset=utf-8"
// });

// resources.set("smiles-drawer.min.js", {
//   content: fs.readFileSync(resourcePath("smiles-drawer.min.js")),
//   mimeType: "application/javascript; charset=utf-8"
// });

// resources.set("smiles-drawer.min.js.map", {
//   content: fs.readFileSync(resourcePath("smiles-drawer.min.js.map")),
//   mimeType: "application/json; charset=utf-8"
// });

const fontPath = resourcePath("fonts");
const fontfilenames = fs.readdirSync(fontPath);
for (const fontfilename of fontfilenames) {
  const filepath = path.join(fontPath, fontfilename);
  const fontType = path.extname(fontfilename).substring(1);
  // resources.set(`fonts/${fontfilename}`, {
  //   content: fs.readFileSync(filepath),
  //   mimeType: `font/${fontType}`
  // });
  resources.set(`fonts/${fontfilename}`,
    new ResourceProxy(
      `font/${fontType}`,
      filepath,
      f => fs.promises.readFile(f, "utf-8")
    )
  );
}

// give the user the option to turn off rendered printing
export function isEnabled(): boolean {
  return vscode.workspace.getConfiguration("print").renderMarkdown;
}

export async function getBodyHtml(generatedResources: Map<string, ResourceProxy>, raw: string, languageId: string) {
  const updatedTokens = await processMarkdown({ LATEX: { displayMode: true } }, raw, generatedResources);
  return marked.parser(updatedTokens);
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
  return [
    "bundled/smiles-drawer.min.js",
  ];
}

function resourcePath(relativePath: string) {
  return path.join(Metadata.ExtensionPath, relativePath);
}
