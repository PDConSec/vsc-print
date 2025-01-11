import braces from 'braces';
import path from 'path';
import * as vscode from 'vscode';
import tildify from '../tildify';
import { ResourceProxy } from './resource-proxy';

export abstract class AbstractDocumentBuilder {
  public dispose() { }
  protected filepath: string;
  public isPreview: boolean;
  public generatedResources: Map<string, ResourceProxy>;
  public baseUrl: string;
  public uri: vscode.Uri;
  public code: string;
  public language: string;
  public printLineNumbers: boolean;
  public startLine: number;
  public fileselection: Array<vscode.Uri>;

  constructor(
    isPreview: boolean,
    generatedResources: Map<string, ResourceProxy>,
    baseUrl: string,
    uri: vscode.Uri,
    code: string = "",
    language: string = "",
    printLineNumbers: boolean,
    startLine: number = 1,
    fileselection: Array<vscode.Uri> = [],
  ) {
    this.filepath = uri.fsPath;
    this.isPreview = isPreview;
    this.generatedResources = generatedResources;
    this.baseUrl = baseUrl;
    this.uri = uri;
    this.code = code;
    this.language = language;
    this.printLineNumbers = printLineNumbers;
    this.startLine = startLine;
    this.fileselection = fileselection;
  }
  public abstract build(): Promise<string>;
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
