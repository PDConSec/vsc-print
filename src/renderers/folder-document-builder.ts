import { logger } from '../logger';
import * as vscode from 'vscode';
import { HtmlDocumentBuilder } from './html-document-builder';
import { DocumentRenderer } from './document-renderer';
import Handlebars from "handlebars";
import { Metadata } from '../metadata';
import tildify from '../tildify';
import { ResourceProxy } from './resource-proxy';

const hbMultiDocument = Handlebars.compile(require("../templates/multi-document.html").default.toString());
const hbFolderItem = Handlebars.compile(require("../templates/multi-document-item.html").default.toString());
const multifileCssRefs =
`
<link href="bundled/default.css" rel="stylesheet" />
<link href="bundled/line-numbers.css" rel="stylesheet" />
<link href="bundled/colour-scheme.css" rel="stylesheet" />
<link href="bundled/settings.css" rel="stylesheet" />
`;

export class FolderDocumentBuilder extends HtmlDocumentBuilder {
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
    const printConfig = vscode.workspace.getConfiguration("print");
    const previewWebsocketPort = Metadata.PreviewWebsocketPort;

    logger.debug(`Folder ${this.workspacePath(this.uri)}`);
    this.filepath = this.uri.fsPath;
    const docs = await this.docsInFolder();
    const summary = printConfig.folder.includeFileList ?
      `<h3 class="filepath">${docs.length} printable files</h3><pre>${docs.map(d => printConfig.filepathAsDocumentHeading === "Relative" ? this.workspacePath(d.uri) : tildify(d.fileName)).join("\n")}</pre>` :
      `<h3 class="filepath">${docs.length} printable files</h3><p>(file list disabled)</p>`;

    if (docs.length > printConfig.folder.maxFiles) {
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
        PreviewWebsocketPort: previewWebsocketPort
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
      printAndClose: printAndClose,
      summary: summary,
      items: multiDocumentItems,
      stylesheetLinks: multifileCssRefs,
      scriptTags: "",
      PreviewWebsocketPort: previewWebsocketPort
    });
  }
}
