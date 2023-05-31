import { IResourceDescriptor } from './IResourceDescriptor';
import * as vscode from "vscode";


export interface IDocumentRenderer {
	isEnabled?: () => boolean;
	getBodyHtml: (raw: string, languageId: string, options?: any) => string;
	getTitle?: (uri: vscode.Uri) => string;
	getCssUriStrings?: (uri: vscode.Uri) => Array<string>;
	getResource?: (name: string, requestingUri: any) => IResourceDescriptor;
}
