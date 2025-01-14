import { logger } from '../logger';
import * as vscode from 'vscode';
import { AbstractDocumentBuilder } from './abstract-document-builder';
import { DocumentRenderer } from './document-renderer';
import Handlebars from "handlebars";
import WebSocket from "ws";
import { ResourceProxy } from './resource-proxy';
import tildify from '../tildify';
import path from 'path';

const hbDocument = Handlebars.compile(require("../templates/document.tpl").default.toString());

export class EditorDocumentBuilder extends AbstractDocumentBuilder {
  private document: vscode.TextDocument;
  private changeHandler: vscode.Disposable | undefined;

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
      "",
      document.languageId,
      printLineNumbers
    );
    this.document = document;
  }

  public dispose(): void {
    if (this.changeHandler) {
      this.changeHandler.dispose();
      this.changeHandler = undefined;
    }
  }

  public configureWebsocket(ws: WebSocket): void {
    const rebindHandlersEveryPageLoad = true;
    if (this.changeHandler) {
      if (rebindHandlersEveryPageLoad) {
        this.changeHandler.dispose();
        this.changeHandler = undefined;
      } else {
        return;
      }
    }

    let timeout: NodeJS.Timeout | undefined;

    const onDocumentChange = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        logger.info("Document change detected, sending refreshPreview message");
        ws.send(JSON.stringify({ type: 'refreshPreview' }));
      }, vscode.workspace.getConfiguration("print").documentSettleMilliseconds);
    };

    this.changeHandler = vscode.workspace.onDidChangeTextDocument(event => {
      if (event.document === this.document) {
        logger.info("onDidChangeTextDocument event fired");
        onDocumentChange();
      }
    });

    ws.onmessage = (event) => {
      var raw = event.data.toString();
      const message = JSON.parse(raw);
      if (message.type === 'scrollOffset') {
        const scrollOffset = message.value;
        ws.send(JSON.stringify({ type: 'restoreScroll', scrollOffset: scrollOffset }));
      }
    };

    logger.info("WebSocket configured for document changes");
  }

  public async build(): Promise<string> {
    const printAndClose = (!this.isPreview).toString();
    const documentRenderer = DocumentRenderer.get(this.language);
    const printConfig = vscode.workspace.getConfiguration("print");

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
    const bodyHtml = await documentRenderer.getBodyHtml(this.generatedResources, this.document.getText(), this.language, options);
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
    });
    return doc;
  }
}
