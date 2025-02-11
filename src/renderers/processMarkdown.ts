import { ResourceProxy } from './resource-proxy';
import { Token, Tokens, marked } from 'marked';
import * as yaml from "yaml";
import { merge } from "lodash";
import * as katex from "katex";
import crypto from "crypto";
import { deflate } from "pako";
import * as vscode from 'vscode';
import 'katex/dist/contrib/mhchem';
import hljs from 'highlight.js';
import { logger } from '../logger';
import * as https from 'https';
import axios from 'axios';
import * as os from "os";
import * as path from 'path';
import * as fs from "fs";
import { resolveRootDoc } from './includes';
import { databaseFencedLanguageService } from "./database-fenced-language/databaseFencedLanguageService";
import { DatabaseDiagramRequest } from "./database-fenced-language/models/request/databaseDiagramRequest";

const HIGHLIGHTJS_LANGS = hljs.listLanguages().map(s => s.toUpperCase());
const KROKI_SUPPORT = [
  "BLOCKDIAG", "BPMN", "BYTEFIELD", "SEQDIAG", "ACTDIAG", "NWDIAG", "PACKETDIAG",
  "RACKDIAG", "C4", "D2", "DBML", "DITAA", "ERD", "EXCALIDRAW", "GRAPHVIZ", "MERMAID",
  "NOMNOML", "PIKCHR", "PLANTUML", "STRUCTURIZR", "SVGBOB", "SYMBOLATOR", "TIKZ",
  "UMLET", "VEGA", "VEGALITE", "WAVEDROM", "WIREVIZ", "DOT"
];
const CACHE_PATH = path.join(os.homedir(), ".vscode-print-resource-cache");
if (!fs.existsSync(CACHE_PATH)) fs.mkdirSync(CACHE_PATH);

// import { fixFalsePrecision, formatXml, applyDiagramStyle, stripPreamble } from './svg-tools';

export async function processFencedBlocks(defaultConfig: any, raw: string, generatedResources: Map<string, ResourceProxy>, rootDocFolder: string) {
  const katexed = raw
    .replace(/\$\$(.+?)\$\$/g, (_, capture) => katex.renderToString(capture, { displayMode: false, throwOnError: false }))
    .replace(/\$\$(.+?)\$\$/gs, (_, capture) => katex.renderToString(capture, { displayMode: true, throwOnError: false }));

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

  let resolvedConfig, filepath;
  let updatedTokens: Array<Token> = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'code') {
      const LANG = token.lang?.toUpperCase();
      if (KROKI_SUPPORT.includes(LANG)) {
        try {
          let resolvedDoc = await resolveRootDoc(token.text, rootDocFolder);
          cachedKrokiRender(resolvedDoc, generatedResources, krokiUrl, LANG, updatedTokens, token);
        } catch (error: any) {
          updatedTokens.push({ block: true, type: "code", lang: token.lang, raw: token.raw, text: `${error.message ?? error}\n\n${token.text}"/>` });
        }
      } else {
        switch (LANG) {
          case "DATABASE":
            const languageService = new databaseFencedLanguageService();
            const parsedRequest: DatabaseDiagramRequest = yaml.parse(token.text) as DatabaseDiagramRequest;
            try {
              const database = await languageService.getDatabaseInformation(parsedRequest);
              const markup = languageService.createKrokiMarkup(database, parsedRequest.Detail);
              cachedKrokiRender(markup.value, generatedResources, krokiUrl, markup.markupLanguage, updatedTokens, token);
            }
            catch (error: any) {
              let errorText = "";

              if (error instanceof AggregateError) {
                // If the error contains(aggregates) multiple errors, construct errorText with all errors
                errorText = `Unable to communicate with database. ${error.errors ?? error}\n\n${token.text}`;
              } else {
                errorText = `Unable to communicate with database. ${error.message ?? error}\n\n${token.text}`;
              }

              updatedTokens.push({ block: true, type: "code", lang: token.lang, raw: token.raw, text: errorText });
            }
            break;
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
              const codeHtml = hljs.highlight(token.lang, token.text).value;
              const codeBlockHtml = `<pre class="code-box">\n<code class="hljs">\n${codeHtml}\n</code>\n</pre>\n`;
              updatedTokens.push({ block: true, type: "html", raw: token.raw, text: codeBlockHtml });
            } else { //unhandled passthrough
              updatedTokens.push(token);
            }
            break;
        }
      }
    } else if (token.type === "html" && token.block) {
      const newToken = token as Tokens.HTML;
      newToken.text = `<div data-source-map="innerHTML">${token.text}</div>`;
      updatedTokens.push(token);
    } else {
      updatedTokens.push(token);
    };
  }
  return updatedTokens;
}

function cachedKrokiRender(resolvedDoc: string, generatedResources: Map<string, ResourceProxy>, krokiUrl: any, LANG: any, updatedTokens: Token[], token: Tokens.Code | Tokens.Generic) {
  const hash = crypto.createHash("sha256");
  hash.update(resolvedDoc);
  let resourcename = `${hash.digest("hex")}.svg`;
  let resource = generatedResources.get(resourcename);
  if (!resource) {
    const resourceCachePath = path.join(CACHE_PATH, resourcename);
    if (fs.existsSync(resourceCachePath)) {
      logger.debug(`Resource file cache hit for ${resourcename}`);
      resource = new ResourceProxy("image/svg+xml", resourcename, async (f) => fs.promises.readFile(path.join(CACHE_PATH, f)));
    } else {
      logger.debug(`Resource file cache miss for ${resourceCachePath}`);
      const payload = Buffer.from(deflate(Buffer.from(resolvedDoc, "utf-8")))
        .toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
      resource = new ResourceProxy(
        "image/svg+xml",
        `${krokiUrl}/${LANG.toLowerCase()}/svg/${payload}`,
        async (u) => {
          const agent = new https.Agent({ rejectUnauthorized: vscode.workspace.getConfiguration("print").rejectUnauthorisedTls });
          const response = await axios.get(u, { httpAgent: agent });
          const responseText = await response.data;
          if (responseText.includes("</svg>")) {
            fs.writeFileSync(resourceCachePath, responseText);
            logger.debug(`Resource file cache write for ${resourceCachePath}`);
          } else {
            logger.warn(`Kroki did not return SVG:\n${responseText}`);
          }
          return responseText;
        }
      );
    }
  }
  generatedResources.set(resourcename, resource);
  updatedTokens.push({ block: true, type: "html", raw: token.raw, text: `<img src="generated/${resourcename}" alt="${token.lang}" class="${LANG}" title="${token.lang}" />` });
}

function getPosition(s: string, t: string, i: number) {
  return s.split(t, i).join(t).length;
}
