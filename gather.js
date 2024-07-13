const fs = require('fs').promises;
const path = require('path');

(async () => {
  await fs.rm("dist", { recursive: true });
  await fs.mkdir("dist", { recursive: true });
  await fs.cp("node_modules/katex/dist/fonts", "dist/fonts", { recursive: true });
  await fs.copyFile("assets/favicon.ico", "dist/favicon.ico");
  await fs.copyFile("node_modules/katex/dist/katex.css", "dist/katex.css");
  await fs.copyFile("node_modules/smiles-drawer/dist/smiles-drawer.min.js", "dist/smiles-drawer.min.js");
  await fs.copyFile("node_modules/smiles-drawer/dist/smiles-drawer.min.js.map", "dist/smiles-drawer.min.js.map");
  await fs.copyFile("node_modules/mermaid/dist/mermaid.js", "dist/mermaid.js");
})();

