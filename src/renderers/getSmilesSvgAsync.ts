// const SmilesDrawer = require('smiles-drawer');
// import { dom } from "./dom";

// global.document = dom.window.document;
// global.window = dom.window as any;

// export async function getSmilesSvgAsync(smiles: string, options: any): Promise<string> {
//   const svgDrawer = new SmilesDrawer.SvgDrawer(options);
//   const parseTree = await new Promise((resolve, reject) => SmilesDrawer.parse(smiles, resolve, reject));
//   const svgElement = svgDrawer.draw(parseTree, 'svg', 'light');
//   return svgElement.outerHTML;
// }
