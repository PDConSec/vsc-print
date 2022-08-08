import { env } from 'vscode';
const locKey = require("../out/extension.nls.metadata.json").keys;
const locVal: any = {
  "de": require("../out/extension.nls.de.json"),
	"en": require("../out/extension.nls.en.json"),
	"es": require("../out/extension.nls.es.json"),
	"fr": require("../out/extension.nls.fr.json"),
	"zh": require("../out/extension.nls.zh.json")
};

export function localise(key: string): string {
  const i: number = locKey.indexOf(key);
  let translations = locVal[env.language] || locVal["en"];
  return i == -1 ? key : translations[i];
}
export const filenameByCaption: any = {
  "A11 Y": "a11y-light",
  "Arduino": "arduino-light",
  "Ascetic": "ascetic",
  "Atom One": "atom-one-light",
  "Atelier Cave": "atelier-cave-light",
  "Atelier Dune": "atelier-dune-light",
  "Atelier Estuary": "atelier-estuary-light",
  "Atelier Forest": "atelier-forest-light",
  "Atelier Heath": "atelier-heath-light",
  "Atelier Lakeside": "atelier-lakeside-light",
  "Atelier Plateau": "atelier-plateau-light",
  "Atelier Savanna": "atelier-savanna-light",
  "Atelier Seaside": "atelier-seaside-light",
  "Atelier Suplhur Pool": "atelier-sulphurpool-light",
  "Color Brewer": "color-brewer",
  "Docco": "docco",
  "Foundation": "foundation",
  "GitHub": "github",
  "GitHub Gist": "github-gist",
  "Google Code": "googlecode",
  "Grayscale": "grayscale",
  "Gruvbox": "gruvbox-light",
  "Idea": "idea",
  "ISBL": "isbl-editor-light",
	"Kimbie": "kimbie.light",
	"Lightfair": "lightfair",
  "Magula": "magula",
  "Mono Blue": "mono-blue",
  "nnfx": "nnfx",
  "Paraiso": "paraiso-light",
  "PureBasic": "purebasic",
  "QTcreator": "qtcreator_light",
  "RouterOS": "routeros",
  "Schoolbook": "schoolbook",
  "Stack Overflow": "stackoverflow-light",
  "Visual Studio": "vs",
  "XCode": "xcode"
}
export const captionByFilename: any = {
  "a11y-light": "A11 Y",
  "arduino-light": "Arduino",
  "ascetic": "Ascetic",
  "atom-one-light": "Atom One",
  "atelier-cave-light": "Atelier Cave",
  "atelier-dune-light": "Atelier Dune",
  "atelier-estuary-light": "Atelier Estuary",
  "atelier-forest-light": "Atelier Forest",
  "atelier-heath-light": "Atelier Heath",
  "atelier-lakeside-light": "Atelier Lakeside",
  "atelier-plateau-light": "Atelier Plateau",
  "atelier-savanna-light": "Atelier Savanna",
  "atelier-seaside-light": "Atelier Seaside",
  "atelier-sulphurpool-light": "Atelier Suplhur Pool",
  "color-brewer": "Color Brewer",
  "docco": "Docco",
  "foundation": "Foundation",
  "github": "GitHub",
  "github-gist": "GitHub Gist",
  "googlecode": "Google Code",
  "grayscale": "Grayscale",
  "gruvbox-light": "Gruvbox",
  "idea": "Idea",
  "isbl-editor-light": "ISBL",
  "kimbie.light": "Kimbie",
  "magula": "Magula",
  "mono-blue": "Mono Blue",
  "nnfx": "nnfx",
  "paraiso-light": "Paraiso",
  "purebasic": "PureBasic",
  "qtcreator_light": "QTcreator",
  "routeros": "RouterOS",
  "school-book": "School-book",
  "stackoverflow-light": "Stack Overflow",
  "vs": "Visual Studio",
  "xcode": "XCode"
}
export const defaultCss: string = require("highlight.js/styles/default.css").default.toString();
