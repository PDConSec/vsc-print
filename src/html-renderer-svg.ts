import { Uri } from 'vscode';

export function getBodyHtml(raw: string) {
	return raw;
}

export function getCssUriStringArray(): Array<string> {
	return [];
}

export function getTitle(filename: string) {
	return filename;
}

export function getResource(uri: Uri): Buffer | string {
	throw "ERR_NOTIMPL";
}