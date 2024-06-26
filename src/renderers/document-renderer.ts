import { IResourceDescriptor } from './IResourceDescriptor';
import { logger } from '../logger';
import * as path from "path";
import * as vscode from "vscode";
import * as htmlRendererSourcecode from "./html-renderer-sourcecode";
import { IDocumentRenderer } from './IDocumentRenderer';
import tildify from '../tildify';

export class DocumentRenderer {

  options: IDocumentRenderer;

  constructor(options: IDocumentRenderer) {
    this.options = options;
  }

  public async getBodyHtml(generatedResources: Map<string, IResourceDescriptor>, raw: string, languageId: string, options?: any) {
    return this.options.getBodyHtml(generatedResources, raw, languageId, options);
  }

  public getTitle(uri: vscode.Uri) {
    if (this.options.getTitle) {
      return this.options.getTitle(uri);
    } else {
      const printConfig = vscode.workspace.getConfiguration("print");
      let filename = uri.fsPath;
      const parts = filename.split(path.sep);
      switch (printConfig.filepathInDocumentTitle) {
        case "No path":
          return parts[parts.length - 1];
        case "Abbreviated path":
          if (parts.length > 3) {
            filename = [parts[0], "...", parts[parts.length - 2], parts[parts.length - 1]].join(path.sep);
          }
          return filename;
        case "Workspace relative":
          const wf = vscode.workspace.getWorkspaceFolder(uri);
          if (wf)
            return path.relative(wf.uri.fsPath, filename);
          else
            return tildify(uri.fsPath); // it's not IN a workspace 
        default:
          throw "THIS CANNOT HAPPEN";
      }
    }
  }

  public isEnabled() {
    if (this.options.isEnabled) {
      return this.options.isEnabled();
    } else {
      logger.debug("HTML renderer does not implement isEnabled, defaulting to true");
      return true;
    }
  }

  static __documentRenderers = new Map<string, DocumentRenderer>();

  static __defaultDocumentOptions: IDocumentRenderer = {
    getBodyHtml: htmlRendererSourcecode.getBodyHtml,
    getCssUriStrings: htmlRendererSourcecode.getCssUriStrings,
    getResource: htmlRendererSourcecode.getResource
  };

  static __defaultDocumentRenderer = new DocumentRenderer(DocumentRenderer.__defaultDocumentOptions);

  public static register(langIds: string | string[], options: IDocumentRenderer) {
    const documentRenderer = new DocumentRenderer(options);
    langIds = typeof langIds === "string" ? [langIds] : langIds;
    langIds.forEach(langId =>
      DocumentRenderer.__documentRenderers.set(langId, documentRenderer)
    );
    logger.debug(`Registered a document renderer for the following languages: ${langIds.join(", ")}`);
    return logger;
  }

  public static get(langId: string) {
    const documentRenderer = DocumentRenderer.__documentRenderers.get(langId);
    if (!documentRenderer) {
      logger.debug(`No document renderer is registered for ${langId}, using default (source code renderer)`);
      return this.__defaultDocumentRenderer;
    } else {
      const isEnabled = documentRenderer.isEnabled();
      if (documentRenderer.isEnabled()) {
        logger.debug(`Using the document renderer for ${langId}`);
        return documentRenderer;
      } else {
        logger.debug(`Document renderer for ${langId} is disabled, using default (source code renderer)`);
        return this.__defaultDocumentRenderer;
      }
    }
  }

  public getCssLinks(uri: vscode.Uri): string {
    let result: string = "";
    if (this.options.getCssUriStrings) {
      const us = this.options.getCssUriStrings(uri);
      result = us.map(uriString => `\t<link href="${uriString}" rel="stylesheet" />`).join("\n");
    }
    return result;
  }

  public getScriptTags(uri: vscode.Uri): string {
    let result: string = "";
    if (this.options.getScriptUriStrings) {
      const us = this.options.getScriptUriStrings(uri);
      result = us.map(uriString => `\t<script src="${uriString}"></script>`).join("\n");
    }
    return result;
  }

  public getResource(name: string, requestingUri: any): IResourceDescriptor {
    if (this.options.getResource) {
      return this.options.getResource(name, requestingUri);
    } else {
      throw new Error(`Document renderer produced HTML that references "${name}" but does not implement getResource`);
    }
  }

}