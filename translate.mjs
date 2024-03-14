import { promises as fsPromises } from "fs";
import path from 'path';
import * as marked from 'marked';
import axios from 'axios';

const targetLanguages = [
	"zh-Hans", // Chinese Simplified
	"ja",      // Japanese
	"es",      // Spanish
	"ru",      // Russian
	"pt",      // Portuguese (Brazil)
	"fr",      // French
	"ko",      // Korean
	"de",      // German
	"zh-Hant", // Chinese Traditional
	"it",      // Italian
	"pl",      // Polish
	"hu",      // Hungarian
	"cs",      // Czech
	"bg",      // Bulgarian
	"tr",      // Turkish
	"my",      // Myanmar
	"ca",      // Catalan
	"lt",      // Lithuanian
	"hy"       // Armenian
];
const apiKey = process.env.AZURE_TRANSLATOR_KEY;
const region = process.env.AZURE_TRANSLATOR_REGION;
const translateEndpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${targetLanguages.join("&to=")}`;
const doc = [];
const sourcePath = process.argv[2];

async function translate(text) {
	if (targetLanguages.includes("en"))
		return { "en": text };
	const translations = {};
	const response = await axios.post(
		translateEndpoint,
		[{ text }],
		{
			headers: {
				'Ocp-Apim-Subscription-Key': apiKey,
				'Ocp-Apim-Subscription-Region': region,
				'Content-Type': 'application/json',
			},
		}
	);
	for (var entry of response.data[0]?.translations) {
		translations[entry.to] = entry.text
			.replace(/\\u0027/g, "'");
	}
	return translations;
}

function addLanguageIdentifierToFilePath(filePath, languageIdentifier) {
	const baseName = path.basename(filePath, path.extname(filePath));
	const newFileName = `${baseName}-${languageIdentifier}${path.extname(filePath)}`;
	const newFilePath = path.join(path.dirname(filePath), newFileName);
	return newFilePath;
}

doc["source"] = await fsPromises.readFile(sourcePath, "utf8");
targetLanguages.forEach(language => doc[language] = "");

const tokens = marked.lexer(doc["source"]);
let xlat;
for (const token of tokens) {
	switch (token.type) {
		case "list":
			for (let index = 0; index < token.items.length; index++) {
				const item = token.items[index];
				let indent = item.raw.match(/^(\s*)/)[1];
				let bullet = item.raw.match(/^\s*(\S+)/)[1];
				xlat = await translate(item.text);
				targetLanguages.forEach(language => doc[language] += `${indent}${bullet} ${xlat[language]}\n`);
			}
			break;
		case "heading":
			xlat = await translate(token.text);
			targetLanguages.forEach(language => {
				let foo = `${"#".repeat(token.depth)} ${xlat[language]}\n\n`
				doc[language] += foo;
			});
			break;
		case "paragraph":
			for (var t of token.tokens)
				switch (t.type) {
					case "text":
						xlat = await translate(t.text);
						targetLanguages.forEach(language => doc[language] += xlat[language]);
						break;
					case "em":
						xlat = await translate(t.text);
						targetLanguages.forEach(language => doc[language] += `_${xlat[language]}_`);
						break;
					case "strong":
						xlat = await translate(t.text);
						targetLanguages.forEach(language => doc[language] += `**${xlat[language]}**`);
						break;
					case "codespan":
						xlat = await translate(t.text);
						targetLanguages.forEach(language => doc[language] += `\`${xlat[language]}\``);
						break;
					case "link":
						xlat = await translate(t.text);
						targetLanguages.forEach(language => doc[language] += `[${xlat[language]}](${t.href})`);
						break;
					case "html":
					case "image":
						targetLanguages.forEach(language => doc[language] += t.raw); //passthrough
						break;
					default:
						throw `Markdown processing error - unhandled inline token type "${t.type}"`;
				}
			break;
		case "space":
		case "code":
			targetLanguages.forEach(language => doc[language] += token.raw);
			break;
		case "table":
			targetLanguages.forEach(language => doc[language] += token.raw); //passthrough
			break;
		default:
			throw `Markdown processing error - unhandled block token type "${token.type}"`;
	}
}

targetLanguages.forEach(async language => {
	let filePath = addLanguageIdentifierToFilePath(sourcePath, language);
	await fsPromises.writeFile(filePath, doc[language].replace(/\[([^\]]+)\]\s+\(/g, "[$1]("));
});

