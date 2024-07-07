import { IResourceDescriptor } from './IResourceDescriptor';
import { Token, Tokens, marked } from 'marked';
import * as yaml from "yaml";
import { merge } from "lodash";
import * as katex from "katex";
import crypto from "crypto";
import { deflate } from "pako";
import * as vscode from 'vscode';
import 'katex/dist/contrib/mhchem';
import hljs from 'highlight.js';

const HIGHLIGHTJS_LANGS = hljs.listLanguages().map(s => s.toUpperCase());
const KROKI_SUPPORT = ["BLOCKDIAG", "BPMN", "BYTEFIELD", "SEQDIAG", "ACTDIAG", "NWDIAG", "PACKETDIAG", "RACKDIAG", "C4", "D2", "DBML", "DITAA", "ERD", "EXCALIDRAW", "GRAPHVIZ", "MERMAID", "NOMNOML", "PIKCHR", "PLANTUML", "STRUCTURIZR", "SVGBOB", "SYMBOLATOR", "TIKZ", "UMLET", "VEGA", "VEGA-LITE", "WAVEDROM", "WIREVIZ"];

// import { fixFalsePrecision, formatXml, applyDiagramStyle, stripPreamble } from './svg-tools';

export async function processFencedBlocks(defaultConfig: any, raw: string, generatedResources: Map<string, IResourceDescriptor>) {
  const katexed = raw
    .replace(/\$\$(.+)\$\$/g, (_, capture) => katex.renderToString(capture, { displayMode: true }))
    .replace(/\$%(.+)%\$/g, (_, capture) => katex.renderToString(capture, { displayMode: false }));

  const tokens = marked.lexer(katexed);
  const krokiUrl = vscode.workspace.getConfiguration("print").krokiUrl;
  let activeConfigName = "DEFAULT";
  const namedConfigs: any = { DEFAULT: defaultConfig };
  const stack: any[] = [];

  function getConfig(lang?: string): any {
    const result: any = {};
    merge(result, namedConfigs.DEFAULT);
    if (activeConfigName !== "DEFAULT") {
      merge(result, namedConfigs[activeConfigName]);
    }
    for (let i = 0; i < stack.length; i++) {
      merge(result, stack[i]);
    }
    return lang ? result[lang] : result;
  }

  let resolvedConfig, svg, filepath;
  let updatedTokens: Array<Token> = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'code') {
      const LANG = token.lang.toUpperCase();
      if (KROKI_SUPPORT.includes(LANG)) {
        try {
          const hash = crypto.createHash("sha256");
          hash.update(token.text);
          const resourcename = hash.digest("hex");
          if (!generatedResources.has(resourcename)) {
            const payload = Buffer.from(deflate(Buffer.from(token.text, "utf-8")))
              .toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
            const response = await fetch(`${krokiUrl}/${LANG.toLowerCase()}/svg/${payload}`);
            const svg = await response.text();
            if (svg.startsWith("<svg")) {
              generatedResources.set(resourcename, { content: svg, mimeType: "image/svg+xml" });
              updatedTokens.push({ block: true, type: "html", raw: token.raw, text: `<img src="generated/${resourcename}" alt="${token.text}"` });
            } else {
              updatedTokens.push({ block: true, type: "code", lang: "diagram-error", raw: token.raw, text: svg.substring(getPosition(svg, ":", 2) + 2, svg.indexOf("^\n") + 1) });
            }
          }
        } catch (error: any) {
          updatedTokens.push({ block: true, type: "code", lang: token.lang, raw: token.raw, text: `${error.message ?? error}\n\n${token.text}"/>` });
        }
      } else {
        switch (LANG) {
          case "LATEX":
            updatedTokens.push({ block: true, type: "html", raw: token.raw, text: katex.renderToString(token.text, getConfig(LANG)) });
            break;
          //#region config management
          case "USE":
            if (namedConfigs[token.text]) {
              activeConfigName = token.text;
            } else {
              console.log(`Config name "${token.text}" is not defined`);
            }
            break;
          case "PUSH":
            resolvedConfig = yaml.parse(token.text);
            stack.push(resolvedConfig);
            break;
          case "POP":
            if (stack.length > 1) stack.pop();
            break;
          case "SHOW":
            resolvedConfig = yaml.stringify(getConfig());
            updatedTokens.push({ block: true, type: "code", raw: token.raw, text: resolvedConfig });
            break;
          //#endregion
          default: 
            if (HIGHLIGHTJS_LANGS.includes(LANG)) {
              const codeBlock = `<pre class="code-box">\n<code class="hljs">\n${hljs.highlight(token.lang, token.text).value}\n</code>\n</pre>\n`;
              updatedTokens.push({ block: true, type: "html", raw: token.raw, text: codeBlock });
            } else { //unhandled passthrough
              updatedTokens.push(token);
            }
            break;
        }
      }
    } else {
      updatedTokens.push(token);
    };
  }
  return updatedTokens;
}

function getPosition(s: string, t: string, i: number) {
  return s.split(t, i).join(t).length;
}

