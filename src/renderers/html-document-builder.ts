import { logger } from '../logger';
import braces from 'braces';
import path from 'path';
import * as vscode from 'vscode';
import { DocumentRenderer } from './document-renderer';
import micromatch from 'micromatch';
import tildify from '../tildify';
import { PrintSession } from '../print-session';
import { ResourceProxy } from './resource-proxy';
import Handlebars from "handlebars";

const hbMultiDocument = Handlebars.compile(require("../templates/multi-document.html").default.toString());
const hbFolderItem = Handlebars.compile(require("../templates/multi-document-item.html").default.toString());
const hbDocument = Handlebars.compile(require("../templates/document.html").default.toString());
const multifileCssRefs = 
`
<link href="bundled/default.css" rel="stylesheet" />
<link href="bundled/line-numbers.css" rel="stylesheet" />
<link href="bundled/colour-scheme.css" rel="stylesheet" />
<link href="bundled/settings.css" rel="stylesheet" />
`;
export class HtmlDocumentBuilder {
  private filepath: string;
  constructor(
    public isPreview: boolean,
    public generatedResources: Map<string, ResourceProxy>,
    public baseUrl: string,
    public uri: vscode.Uri,
    public code: string = "",
    public language: string = "",
    public printLineNumbers: boolean,
    public startLine: number = 1,
    public multiselection: Array<vscode.Uri> = []
  ) {
    this.filepath = uri.fsPath;
  }
  public async build(): Promise<string> {
    const printAndClose = (!this.isPreview).toString();
    const documentRenderer = DocumentRenderer.get(this.language);
    const printConfig = vscode.workspace.getConfiguration("print");
    if (this.multiselection!.length) {
      logger.debug(`Selected files`);
      const docs = await this.docsInMultiselection();
      const summary =
        `<h3>${docs.length} printable files</h3><pre>${docs.map(d => printConfig.filepathAsDocumentHeading === "Relative" ? this.workspacePath(d.uri) : tildify(d.fileName)).join("\n")}</pre>\r`;
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
        printAndClose: printConfig.printAndClose,
        summary: summary,
        items: folderItems,
        stylesheetLinks: multifileCssRefs,
        scriptTags: ""
      });
    } else if (this.language === "folder") {
      logger.debug(`Folder ${this.workspacePath(this.uri)}`);
      this.filepath = this.uri.fsPath;
      const docs = await this.docsInFolder();
      const summary = printConfig.folder.includeFileList ?
        `<h3>${docs.length} printable files</h3><pre>${docs.map(d => printConfig.filepathAsDocumentHeading === "Relative" ? this.workspacePath(d.uri) : tildify(d.fileName)).join("\n")}</pre>` :
        `<h3>${docs.length} printable files</h3><p>(file list disabled)</p>`;

      if (docs.length > printConfig.folder.maxFiles) {
        const msgTooManyFiles = 
          vscode.l10n.t("The selected directory contains too many files to print them all. Only the summary will be printed.");
        vscode.window.showWarningMessage(msgTooManyFiles);
        return hbMultiDocument({
          baseUrl: this.baseUrl,
          documentTitle: this.workspacePath(this.uri),
          documentHeading: `Folder ${this.workspacePath(this.uri)}`,
          printAndClose: printConfig.printAndClose,
          summary: summary,
          items: [],
          stylesheetLinks: multifileCssRefs,
          scriptTags: ""
        });
      }
      const multiDocumentItems = await Promise.all(docs.map(async (doc) => {
        const renderer = DocumentRenderer.get(doc.languageId);
        const bodyText = doc.getText();
        const langId = doc.languageId;
        const options = { startLine: 1, lineNumbers: this.printLineNumbers, uri: this.uri };
        const bodyHtml = await renderer.getBodyHtml(this.generatedResources, bodyText, langId, options);
        return hbFolderItem({
          multiDocumentItemTitle: printConfig.filepathAsDocumentHeading === "Relative" ? this.workspacePath(doc.uri) : tildify(doc.fileName),
          multiDocumentItemContent: `<table class="hljs">\n${bodyHtml}\n</table>\n`
        });
      }));
      return hbMultiDocument({
        baseUrl: this.baseUrl,
        documentTitle: this.workspacePath(this.uri),
        documentHeading: `Folder ${this.workspacePath(this.uri)}`,
        printAndClose: printConfig.printAndClose,
        summary: summary,
        items: multiDocumentItems,
        stylesheetLinks: multifileCssRefs,
        scriptTags: ""
      });
    } else { // one file
      logger.debug(`Printing ${this.filepath}`);
      let docHeading = "";
      if (printConfig.filepathHeadingForIndividuallyPrintedDocuments) {
        switch (printConfig.filepathAsDocumentHeading) {
          case "Absolute":
            docHeading = `<h3>${tildify(this.filepath).replace(/([\\/])/g, "$1<wbr />")}</h3>`;
            break;
          case "Relative":
            const wf = vscode.workspace.getWorkspaceFolder(this.uri);
            // if no workspace then absolute path
            const relativePath = wf ? path.relative(wf!.uri.fsPath, this.filepath) : this.filepath;
            docHeading = `<h3>${relativePath.replace(/([\\/])/g, "$1<wbr />")}</h3>`;
            break;
        }
      }

      let thePath = "";
      if (printConfig.filepathHeadingForIndividuallyPrintedDocuments)
        switch (printConfig.filepathAsDocumentHeading) {
          case "Absolute":
            thePath = `<h3>${tildify(this.uri.fsPath)}</h3>`;
            break;
          case "Relative":
            thePath = `<h3>${this.workspacePath(this.uri)}</h3>`;
            break;
        }
      let options = {
        startLine: this.startLine,
        lineNumbers: this.printLineNumbers,
        uri: this.uri
      };
      const bodyHtml = await documentRenderer.getBodyHtml(this.generatedResources, this.code, this.language, options);
      const cssLinks = documentRenderer.getCssLinks(this.uri);
      const scriptTags = documentRenderer.getScriptTags(this.uri);
      const documentTitle = documentRenderer.getTitle(this.uri);
      let doc = hbDocument({
        baseUrl: this.baseUrl,
        documentTitle: documentTitle,
        documentHeading: thePath,
        printAndClose: printAndClose,
        content: bodyHtml,
        stylesheetLinks: cssLinks,
        scriptTags: scriptTags
      });
      return doc;
    }
  }
  async docsInMultiselection() {
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
    const fileUris = this.multiselection.filter(uri => !micromatch.isMatch(uri.path, excludeString));
    const docOpenSettlements = await Promise.allSettled(fileUris.map(uri => vscode.workspace.openTextDocument(uri)));
    const docs = await docOpenSettlements
      .filter(dos => dos.status === "fulfilled")
      .map(dos => (dos as PromiseFulfilledResult<vscode.TextDocument>).value);
    return docs;
  }
  async docsInFolder(): Promise<vscode.TextDocument[]> {
    logger.debug(`Enumerating the files in ${this.filepath}`);
    const printConfig = vscode.workspace.getConfiguration("print", null);
    // findFile can't cope with nested brace lists in globs but we can flatten them using the braces package
    let excludePatterns: string[] = printConfig.folder.exclude || [];
    if (excludePatterns.length == 0) {
      excludePatterns.push("**/{data,node_modules,out,bin,obj,.*},**/*.{bin,dll,exe,hex,pdb,pdf,pfx,jpg,jpeg,gif,png,bmp,design}");
    }
    let includePatterns: string[] = printConfig.folder.include || [];
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
    const maxLineCount = printConfig.folder.maxLines;
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
  private flatten(patterns: Array<string>): Array<string> {
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
  workspacePath(uri: vscode.Uri) {
    const wf = vscode.workspace.getWorkspaceFolder(uri);
    let result: string;
    if (wf) {
      result = path.relative(wf!.uri.fsPath, uri.fsPath)
    } else {
      result = tildify(uri.fsPath);
    }
    return result;
  }
}
