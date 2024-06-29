const fs = require('fs').promises;
const path = require('path');

const fontExtensions = ['.ttf', '.otf', ".woff", ".woff2", ".eot"];

async function getFilenames(folderPath, extensions) {
  try {
    // Read the contents of the folder asynchronously
    const files = await fs.readdir(folderPath);

    // Filter for font files (assuming .ttf and .otf extensions for this example)
    const fontFiles = files.filter(file => extensions.includes(path.extname(file).toLowerCase()));

    // Return the list of font files
    return fontFiles;
  } catch (err) {
    console.error('Error reading the folder:', err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

(async () => {
  const folderPath = "node_modules/katex/dist/fonts";
  const outputPath = "src/renderers/resources.ts";

  const fontFilenames = await getFilenames(folderPath, fontExtensions);
  const resourceLoaders = fontFilenames.map(fontfilename => `
resources.set("fonts/${fontfilename}", {
    content: require("../../${folderPath}/${fontfilename}").default.toString(),
    mimeType: "font/${path.extname(fontfilename).substring(1)}"
});`);
  const completeLoaderCode = `
import { IResourceDescriptor } from "./IResourceDescriptor";

//to change this code modify resource-loader-generator/app.js

const resources = new Map<string, IResourceDescriptor>();

${resourceLoaders.join('\n\n')}

export default resources;

`;
  await fs.writeFile(outputPath, completeLoaderCode);
  await fs.mkdir("dist", { recursive: true });
  await fs.copyFile("node_modules/mermaid/dist/mermaid.min.js", "dist/mermaid.min.js");
})();

