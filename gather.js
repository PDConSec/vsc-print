const fs = require('fs').promises;
const path = require('path');

(async () => {
  await fs.rm("dist", { recursive: true });
  await fs.mkdir("dist", { recursive: true });
  await fs.cp("node_modules/katex/dist/fonts", "dist/fonts", { recursive: true });
  await fs.copyFile("node_modules/katex/dist/katex.css", "dist/katex.css");
  await fs.copyFile("node_modules/mermaid/dist/mermaid.js", "dist/mermaid.js");
})();

