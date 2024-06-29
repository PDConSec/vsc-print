import { IResourceDescriptor } from './IResourceDescriptor';
import { Token, marked } from 'marked';
import * as yaml from "yaml";
import { merge } from "lodash";
import * as katex from "katex";
import { v4 as uuidv4 } from "uuid";
import { getDotSvgAsync } from './getDotSvgAsync';
// import { fixFalsePrecision, formatXml, applyDiagramStyle, stripPreamble } from './svg-tools';

const svgContributors = ["YUML", "DOT", "SMILES"];
export async function processFencedBlocks(defaultConfig: any, raw: string, generatedResources: Map<string, IResourceDescriptor>) {
  const tokens = marked.lexer(raw);
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
      if (svgContributors.includes(LANG)) {
        resolvedConfig = getConfig(LANG);
        filepath = `${LANG}-${uuidv4()}.svg`;
        switch (LANG) {
          case "DOT":
            svg = await getDotSvgAsync(token.text, resolvedConfig);
            // svg = reparentGraphicalChildren(svg);
            break;
        }
        const generatedResourceName = uuidv4();
        let resourceDescriptor: IResourceDescriptor = {
          mimeType: "image/svg+xml",
          content: svg!
        };
        generatedResources.set(generatedResourceName, resourceDescriptor);
        updatedTokens.push({ block: true, type: "html", raw: token.raw, text: `<img alt="${generatedResourceName}" src="generated/${generatedResourceName}" class="${LANG}"/>` });
        // updatedTokens.push({ block: true, type: "html", raw: token.raw, text: `<img src="data:image/svg+xml;base64,${btoa(svg!)}" class="${LANG}"/>` });
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
          case "MERMAID":
            updatedTokens.push({ block: true, type: "html", raw: token.raw, text: `<pre class="mermaid">\n${token.text}\n</pre>` });
            break;
          default: //unhandled passthrough
            updatedTokens.push(token);
            break;
        }
      }
    } else {
      updatedTokens.push(token);
    };
  }
  return updatedTokens;
}

