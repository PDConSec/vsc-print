import { logger } from '../logger';
import * as vscode from 'vscode';
import { HtmlDocumentBuilder } from './html-document-builder';
import { DocumentRenderer } from './document-renderer';
import Handlebars from "handlebars";
import { Metadata } from '../metadata';
import { ResourceProxy } from './resource-proxy';
import tildify from '../tildify';
import path from 'path';

const hbDocument = Handlebars.compile(require("../templates/document.html").default.toString());

export class EditorDocumentBuilder extends HtmlDocumentBuilder {
  private document: vscode.TextDocument;

  constructor(
    isPreview: boolean,
    generatedResources: Map<string, ResourceProxy>,
    baseUrl: string,
    printLineNumbers: boolean,
    document: vscode.TextDocument
  ) {
    super(
      isPreview,
      generatedResources,
      baseUrl,
      document.uri,
      document.getText(),
      document.languageId,
      printLineNumbers
    );
    this.document = document;
  }

  public async build(): Promise<string> {
    const printAndClose = (!this.isPreview).toString();
    const documentRenderer = DocumentRenderer.get(this.language);
    const printConfig = vscode.workspace.getConfiguration("print");
    const previewWebsocketPort = Metadata.PreviewWebsocketPort;

    logger.debug(`Printing ${this.filepath}`);
    let docHeading = "";
    if (printConfig.filepathHeadingForIndividuallyPrintedDocuments) {
      switch (printConfig.filepathAsDocumentHeading) {
        case "Absolute":
          docHeading = `<h3 class="filepath">${tildify(this.filepath).replace(/([\\/])/g, "$1<wbr />")}</h3>`;
          break;
        case "Relative":
          const wf = vscode.workspace.getWorkspaceFolder(this.uri);
          const relativePath = wf ? path.relative(wf!.uri.fsPath, this.filepath) : this.filepath;
          docHeading = `<h3 class="filepath">${relativePath.replace(/([\\/])/g, "$1<wbr />")}</h3>`;
          break;
      }
    }

    let thePath = "";
    if (printConfig.filepathHeadingForIndividuallyPrintedDocuments)
      switch (printConfig.filepathAsDocumentHeading) {
        case "Absolute":
          thePath = `<h3 class="filepath">${tildify(this.uri.fsPath)}</h3>`;
          break;
        case "Relative":
          thePath = `<h3 class="filepath">${this.workspacePath(this.uri)}</h3>`;
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
      scriptTags: scriptTags,
      PreviewWebsocketPort: previewWebsocketPort
    });
    return doc;
  }
}
