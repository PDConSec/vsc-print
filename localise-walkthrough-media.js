const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { log } = require('console');

const workspaceDir = __dirname;
const nlsFilesPattern = /^package\.nls\.([^\.]+)\.json$/;
const baseNlsFile = path.join(workspaceDir, 'package.nls.json');
const azureTranslateEndpoint = 'https://api.cognitive.microsofttranslator.com/translate';
const azureTranslateKey = process.env.AZURE_TRANSLATOR_KEY;
const azureTranslateRegion = process.env.AZURE_TRANSLATOR_REGION;

if (!azureTranslateKey || !azureTranslateRegion) {
  console.error('AZURE_TRANSLATOR_KEY and AZURE_TRANSLATOR_REGION environment variables must be set.');
  process.exit(1);
}

console.log('Updating walkthrough media URLs...');
console.log('Workspace directory:', workspaceDir);
console.log('Base NLS file:', baseNlsFile);

async function updateWalkthroughMedia() {
  try {
    const baseData = await fs.readFile(baseNlsFile, 'utf8');
    let baseJson = JSON.parse(baseData);
    for (const key in baseJson) {
      if (!(baseJson[key].includes('{locale}'))) {
        delete baseJson[key];
      }
    }
    console.log('Localisable paths:', JSON.stringify(baseJson, null, 2));

    const files = await fs.readdir(workspaceDir);
    for (const file of files) {
      const match = file.match(nlsFilesPattern);
      if (match) {
        const locale = match[1];
        const filePath = path.join(workspaceDir, file);
        try {
          const data = await fs.readFile(filePath, 'utf8');
          let json = JSON.parse(data);

          let updated = false;
          for (const key in baseJson) {

            // Substitute locale in the setting
            json[key] = baseJson[key].replace('{locale}', locale);
            const resolvedLocalePath = path.join(workspaceDir, json[key]);

            // Read UTF8 text from the file system using the resolved path
            let sourceText = await fs.readFile(path.join(workspaceDir, baseJson[key]), 'utf8');

            // Capture markdown images and links
            const imagePlaceholder = '[[IMAGE_PLACEHOLDER]]';
            const linkPlaceholder = '[[LINK_PLACEHOLDER]]';
            const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

            const images = [];
            const links = [];

            sourceText = sourceText.replace(imageRegex, (match, altText, url) => {
              images.push({ altText: altText, url: url.replace('{locale}', locale) });
              return imagePlaceholder;
            });

            sourceText = sourceText.replace(linkRegex, (match, text, url) => {
              links.push({ text, url });
              return linkPlaceholder;
            });

            // Translate the referenced document and image alt texts
            try {
              const response = await axios({
                baseURL: azureTranslateEndpoint,
                url: '',
                method: 'post',
                headers: {
                  'Ocp-Apim-Subscription-Key': azureTranslateKey,
                  'Ocp-Apim-Subscription-Region': azureTranslateRegion,
                  'Content-type': 'application/json'
                },
                params: {
                  'api-version': '3.0',
                  'to': locale
                },
                data: [{
                  'text': sourceText
                }, ...images.map(image => ({ 'text': image.altText }))],
                responseType: 'json'
              });

              let translatedText = response.data[0].translations[0].text;
              const translatedAltTexts = response.data.slice(1).map(item => item.translations[0].text);

              // Restore markdown images and links
              translatedText = translatedText.replace(imagePlaceholder, () => {
                const image = images.shift();
                const translatedAltText = translatedAltTexts.shift();
                return `![${translatedAltText}](${image.url})`;
              });

              translatedText = translatedText.replace(linkPlaceholder, () => {
                const link = links.shift();
                return `[${link.text}](${link.url})`;
              });

              // Write the translated text back to the file system using the resolved path
              await fs.writeFile(resolvedLocalePath, translatedText, 'utf8');
              console.log("Generated file: ", resolvedLocalePath);

              updated = true;
            } catch (err) {
              console.error(`Error translating text for key ${key}:`, err);
            }
          }

          if (updated) {
            await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf8');
          }
        } catch (err) {
          console.error(`Error processing file ${filePath}:`, err);
        }
      }
    }
  } catch (err) {
    console.error(`Error updating walkthrough media:`, err);
  }
}

(async () => {
  await updateWalkthroughMedia();
  console.log('Done.');
})();