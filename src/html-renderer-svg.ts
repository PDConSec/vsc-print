import { languages } from 'vscode';
export function getBodyHtml(raw: string, languageId:string) {
	return raw;
}

// demo only, not actually specified by registration
// default behaviour is more appropriate (shortened filepath)
export function getTitle(filepath: string) {
	return "SVG custom title";
}

