import { logger } from '../logger';
import * as vscode from 'vscode';
import { AbstractDocumentBuilder } from './abstract-document-builder';
import { DocumentRenderer } from './document-renderer';
import Handlebars from "handlebars";
import { Metadata } from '../metadata';
import tildify from '../tildify';
import { ResourceProxy } from './resource-proxy';
import braces from 'braces';

const hbMultiDocument = Handlebars.compile(require("../templates/multi-document.tpl").default.toString());
const hbFolderItem = Handlebars.compile(require("../templates/multi-document-item.tpl").default.toString());
const multifileCssRefs =
`<link href="bundled/default.css" rel="stylesheet" />
<link href="bundled/line-numbers.css" rel="stylesheet" />
<link href="bundled/colour-scheme.css" rel="stylesheet" />
<link href="bundled/settings.css" rel="stylesheet" />`;

export class FolderDocumentBuilder extends AbstractDocumentBuilder {
  constructor(
    isPreview: boolean,
    generatedResources: Map<string, ResourceProxy>,
    baseUrl: string,
    uri: vscode.Uri,
    code: string = "",
    language: string = "folder",
    printLineNumbers: boolean
  ) {
    super(isPreview, generatedResources, baseUrl, uri, code, language, printLineNumbers);
  }

  public async build(): Promise<string> {
    const printAndClose = (!this.isPreview).toString();
    const generalConfig = vscode.workspace.getConfiguration("print.general");
    const folderConfig = vscode.workspace.getConfiguration("print.folder");

    logger.debug(`Folder ${this.workspacePath(this.uri)}`);
    this.filepath = this.uri.fsPath;
    const docs = await this.docsInFolder();
    const summary = folderConfig.includeFileList ?
      `<h3 class="filepath">${docs.length} printable files</h3><pre>${docs.map(d => 
        generalConfig.get<string>("filepathStyleInHeadings") === "Relative"
          ? this.workspacePath(d.uri)
          : tildify(d.fileName)
      ).join("\n")}</pre>` :
      `<h3 class="filepath">${docs.length} printable files</h3><p>(file list disabled)</p>`;

    if (docs.length > folderConfig.maxFiles) {
      const msgTooManyFiles =
        vscode.l10n.t("The selected directory contains too many files to print them all. Only the summary will be printed.");
      vscode.window.showWarningMessage(msgTooManyFiles);
      return hbMultiDocument({
        baseUrl: this.baseUrl,
        documentTitle: this.workspacePath(this.uri),
        documentHeading: `Folder ${this.workspacePath(this.uri)}`,
        printAndClose: !this.isPreview,
        summary: summary,
        items: [],
        stylesheetLinks: multifileCssRefs,
        scriptTags: "",
      });
    }
    const multiDocumentItems = await Promise.all(docs.map(async (doc) => {
      const renderer = DocumentRenderer.get(doc.languageId);
      const bodyText = doc.getText();
      const langId = doc.languageId;
      const options = { startLine: 1, lineNumbers: this.printLineNumbers, uri: this.uri };
      const bodyHtml = await renderer.getBodyHtml(this.generatedResources, bodyText, langId, options);
      return hbFolderItem({
        multiDocumentItemTitle: generalConfig.get<string>("filepathStyleInHeadings") === "Relative" ? this.workspacePath(doc.uri) : tildify(doc.fileName),
        multiDocumentItemContent: `<table class="hljs">\n${bodyHtml}\n</table>\n`
      });
    }));
    return hbMultiDocument({
      baseUrl: this.baseUrl,
      documentTitle: this.workspacePath(this.uri),
      documentHeading: `Folder ${this.workspacePath(this.uri)}`,
      printAndClose: printAndClose,
      summary: summary,
      items: multiDocumentItems,
      stylesheetLinks: multifileCssRefs,
      scriptTags: "",
    });
  }

  async docsInFolder(): Promise<vscode.TextDocument[]> {
    logger.debug(`Enumerating the files in ${this.filepath}`);
    const folderConfig = vscode.workspace.getConfiguration("print.folder", null);
    // findFile can't cope with nested brace lists in globs but we can flatten them using the braces package
    let excludePatterns: string[] = folderConfig.exclude || [];
    if (excludePatterns.length == 0) {
      excludePatterns.push("**/{data,node_modules,out,bin,obj,.*},**/*.{bin,dll,exe,hex,pdb,pdf,pfx,jpg,jpeg,gif,png,bmp,design}");
    }
    let includePatterns: string[] = folderConfig.include || [];
    if (includePatterns.length == 0) {
      includePatterns.push("**/*");
    }
    // one item should not be surrounded with braces, they would be treated as literals
    // but flatten them anyway in case the single pattern contains nested braces
    let excludes: string = excludePatterns.length == 1 ? excludePatterns[0] : `{${excludePatterns.join(",")}}`;
    excludePatterns = this.flatten(excludePatterns); //prevent nested alternations
    excludes = excludePatterns.length == 1 ? excludePatterns[0] : `{${excludePatterns.join(",")}}`;
    let includes: string = includePatterns.length == 1 ? includePatterns[0] : `{${includePatterns.join(",")}}`;
    includePatterns = braces.expand(includes);
    includes = includePatterns.length == 1 ? includePatterns[0] : `{${includePatterns.join(",")}}`;

    let rel = new vscode.RelativePattern(this.filepath, includes);
    const maxLineCount = folderConfig.maxLines;
    const matcher = (document: vscode.TextDocument): boolean => document.lineCount < maxLineCount;
    let fileUris = await vscode.workspace.findFiles(rel, excludes);
    logger.debug(`Includes: ${includes}`);
    logger.debug(`Excludes: ${excludes}`);
    const docOpenSettlements = await Promise.allSettled(fileUris.map(uri => vscode.workspace.openTextDocument(uri)));
    const docs = await docOpenSettlements
      .filter(dos => dos.status === "fulfilled")
      .map(dos => (dos as PromiseFulfilledResult<vscode.TextDocument>).value);
    logger.debug(`Eligible: ${fileUris.length} files\n${docs.map(doc => doc.uri.fsPath).join("\n")}`);

    return docs.filter(doc => matcher(doc)).sort((a, b) => {
      const A = a.fileName;
      const B = b.fileName;
      return A < B ? -1 : A > B ? 1 : 0;
    });
  }
}
