export const filenameByCaption: any = {
	"A11 Y": "a11y-light",
	"Arduino": "arduino-light",
	"Ascetic": "ascetic",
	"Atom One": "atom-one-light",
	"Atelier Cave": "base16/atelier-cave-light",
	"Atelier Dune": "base16/atelier-dune-light",
	"Atelier Estuary": "base16/atelier-estuary-light",
	"Atelier Forest": "base16/atelier-forest-light",
	"Atelier Heath": "base16/atelier-heath-light",
	"Atelier Lakeside": "base16/atelier-lakeside-light",
	"Atelier Plateau": "base16/atelier-plateau-light",
	"Atelier Savanna": "base16/atelier-savanna-light",
	"Atelier Seaside": "base16/atelier-seaside-light",
	"Atelier Sulphur Pool": "base16/atelier-sulphurpool-light",
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
	"base16/atelier-cave-light": "Atelier Cave",
	"base16/atelier-dune-light": "Atelier Dune",
	"base16/atelier-estuary-light": "Atelier Estuary",
	"base16/atelier-forest-light": "Atelier Forest",
	"base16/atelier-heath-light": "Atelier Heath",
	"base16/atelier-lakeside-light": "Atelier Lakeside",
	"base16/atelier-plateau-light": "Atelier Plateau",
	"base16/atelier-savanna-light": "Atelier Savanna",
	"base16/atelier-seaside-light": "Atelier Seaside",
	"base16/atelier-sulphurpool-light": "Atelier Suplhur Pool",
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

export function getDefaultCss(): string {
    try {
        return require("highlight.js/styles/default.css").default.toString();
    } catch (error) {
        // Fallback CSS if default.css can't be loaded
        return `
.hljs, .hljs-keyword, .hljs-number, .hljs-property, .hljs-title, .hljs-string, .hljs-variable {
    background: white;
    color: black;
}`;
    }
}
