import { logger } from '../logger';
import * as vscode from 'vscode';
import { AbstractDocumentBuilder } from './abstract-document-builder';
import { DocumentRenderer } from './document-renderer';
import Handlebars from "handlebars";
import { Metadata } from '../metadata';
import tildify from '../tildify';
import { ResourceProxy } from './resource-proxy';
import micromatch from 'micromatch';
import braces from 'braces';

const hbMultiDocument = Handlebars.compile(require("../templates/multi-document.html").default.toString());
const hbFolderItem = Handlebars.compile(require("../templates/multi-document-item.html").default.toString());
const multifileCssRefs =
`
<link href="bundled/default.css" rel="stylesheet" />
<link href="bundled/line-numbers.css" rel="stylesheet" />
<link href="bundled/colour-scheme.css" rel="stylesheet" />
<link href="bundled/settings.css" rel="stylesheet" />
`;

export class FileselectionDocumentBuilder extends AbstractDocumentBuilder {
  constructor(
    isPreview: boolean,
    generatedResources: Map<string, ResourceProxy>,
    baseUrl: string,
    uri: vscode.Uri,
    code: string = "",
    language: string = "fileselection",
    printLineNumbers: boolean,
    startLine: number = 1,
    fileselection: Array<vscode.Uri>
  ) {
    super(isPreview, generatedResources, baseUrl, uri, code, language, printLineNumbers, startLine, fileselection);
  }

  public async build(): Promise<string> {
    const printAndClose = (!this.isPreview).toString();
    const printConfig = vscode.workspace.getConfiguration("print");
    const previewWebsocketPort = Metadata.PreviewWebsocketPort;

    logger.debug(`Selected files`);
    const docs = await this.docsInFileselection();
    const summary =
      `<h3 class="filepath">${docs.length} printable files</h3><pre>${docs.map(d => printConfig.filepathAsDocumentHeading === "Relative" ? this.workspacePath(d.uri) : tildify(d.fileName)).join("\n")}</pre>\r`;
    const folderItems = await Promise.all(docs.map(async (doc) => {
      const renderer = DocumentRenderer.get(doc.languageId);
      const bodyText = doc.getText();
      const langId = doc.languageId;
      const options = { startLine: 1, lineNumbers: this.printLineNumbers, uri: this.uri };
      const bodyHtml = await renderer.getBodyHtml(this.generatedResources, bodyText, langId, options);
      const docHtml = hbFolderItem({
        multiDocumentItemTitle: printConfig.filepathAsDocumentHeading === "Relative" ? this.workspacePath(doc.uri) : tildify(doc.fileName),
        multiDocumentItemContent: `<table class="hljs">\n${bodyHtml}\n</table>\n`
      });
      return docHtml;
    }));
    return hbMultiDocument({
      baseUrl: this.baseUrl,
      documentTitle: "Selected files",
      documentHeading: "Selected files",
      printAndClose: !this.isPreview,
      summary: summary,
      items: folderItems,
      stylesheetLinks: multifileCssRefs,
      scriptTags: "",
      PreviewWebsocketPort: previewWebsocketPort
    });
  }

  async docsInFileselection() {
    const printConfig = vscode.workspace.getConfiguration("print");
    // findFile can't cope with nested brace lists in globs but we can flatten them using the braces package
    let excludePatterns: string[] = printConfig.folder.exclude || [];
    if (excludePatterns.length == 0) {
      excludePatterns.push("**/{data,node_modules,out,bin,obj,.*},**/*.{bin,dll,exe,hex,pdb,pdf,pfx,jpg,jpeg,gif,png,bmp,design}");
    }
    // one item should not be surrounded with braces, they would be treated as literals
    // but flatten them anyway in case the single pattern contains nested braces
    let excludeString: string;
    excludePatterns = this.flatten(excludePatterns); //prevent nested alternations
    excludeString = excludePatterns.length == 1 ? excludePatterns[0] : `{${excludePatterns.join(",")}}`;
    const fileUris = this.fileselection.filter(uri => !micromatch.isMatch(uri.path, excludeString));
    const docOpenSettlements = await Promise.allSettled(fileUris.map(uri => vscode.workspace.openTextDocument(uri)));
    const docs = await docOpenSettlements
      .filter(dos => dos.status === "fulfilled")
      .map(dos => (dos as PromiseFulfilledResult<vscode.TextDocument>).value);
    return docs;
  }

  protected flatten(patterns: Array<string>): Array<string> {
    const result = new Array<string>();
    for (const p of patterns) {
      if (p.includes("{")) {
        let subexpressions = braces.expand(p);
        subexpressions = this.flatten(subexpressions);
        result.splice(0, 0, ...subexpressions);
      }
      else {
        result.push(p)
      }
    }
    return result;
  }
}
