import * as vscode from 'vscode';
import * as path from "path";
import * as fs from "fs";
import { Metadata } from '../metadata';
import { ResourceProxy } from "./resource-proxy";
import { processFencedBlocks as processMarkdown } from './processMarkdown';
import { marked } from 'marked';
import { JSDOM } from 'jsdom';

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
  return vscode.workspace.getConfiguration("print.markdown").get<boolean>("enableRender")!;
}

export async function getBodyHtml(generatedResources: Map<string, ResourceProxy>, raw: string, languageId: string, options: any) {
  const uri: vscode.Uri = options.uri;
  const rootDocumentFolder = path.dirname(uri.fsPath);
  const updatedTokens = await processMarkdown({ LATEX: { displayMode: true } }, raw, generatedResources, rootDocumentFolder);
  let html = marked.parser(updatedTokens);
  const smartQuotesConfig = vscode.workspace.getConfiguration("print.markdown.smartQuotes");
  if (smartQuotesConfig.get<boolean>("enable")) {
    html += "<script src='bundled/smartquotes.js'></script><script>smartquotes();</script>";
  }
  //insert watermark if enabled
  const watermarkConfig = vscode.workspace.getConfiguration("print.markdown.watermark");
  if (watermarkConfig.get<boolean>("enable")) {
    const watermarkText = watermarkConfig.get<string>("text");
    if (watermarkText) {
      const watermarkDiv = `<div class="watermark" >${watermarkText}</div>`;
      //parse the html using jsdom and salt the watermark through the body after every block element
      const dom = new JSDOM(html);
      const document = dom.window.document;
      const body = document.body;
      const blockElements = ["div", "p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre"];
      const children = Array.from(body.children);
      for (const child of children) {
        if (blockElements.includes(child.tagName.toLowerCase())) {
          const watermark = document.createElement("div");
          watermark.innerText = watermarkText;
          watermark.className = "watermark";
          watermark.style.display = "display: none; user-select: none; pointer-events: none;";
          body.insertBefore(watermark, child.nextSibling);
        }
      }
      html = document.body.innerHTML;
    }
  }
  return html;
}

export function getCssUriStrings(): Array<string> {
  const markdownConfig = vscode.workspace.getConfiguration("print.markdown");
  const userSuppliedCssUrls: string[] = markdownConfig.get("stylesheets") ?? [];
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
