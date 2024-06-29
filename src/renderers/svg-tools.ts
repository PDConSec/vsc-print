// import { JSDOM } from 'jsdom';

// export function applyDiagramStyle(svgString: string, config: any): string {
//   let result: string = svgString;
//   if (config?.DiagramStyle === "Hand drawn") {

//     // todo config for "Hand drawn" exposing the filter control values

//     const dom = new JSDOM(svgString, { contentType: 'image/svg+xml' });
//     const doc = dom.window.document;

//     // Create a new <g> element
//     const g = doc.createElementNS('http://www.w3.org/2000/svg', 'g');

//     // Reparent the immediate graphical children of the root
//     const root = doc.documentElement;
//     const children = Array.from(root.children);
//     children.forEach(child => {
//       if (child instanceof doc.defaultView!.SVGElement) {
//         g.appendChild(child);
//       }
//     });

//     // Append the new <g> element to the root
//     root.appendChild(g);

//     // find defs, create it if necessary
//     let defs = root.querySelector("defs");
//     if (!defs) {
//       defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
//       root.appendChild(defs);
//     }

//     // apply the filter
//     const filter = doc.createElementNS('http://www.w3.org/2000/svg', 'filter');
//     filter.setAttribute('id', 'combined-filter');

//     const turbulence = doc.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
//     turbulence.setAttribute('type', 'fractalNoise');
//     turbulence.setAttribute('baseFrequency', '0.005');
//     turbulence.setAttribute('numOctaves', '1');
//     turbulence.setAttribute('result', 'noise');

//     const displacementMap = doc.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
//     displacementMap.setAttribute('in', 'SourceGraphic');
//     displacementMap.setAttribute('in2', 'noise');
//     displacementMap.setAttribute('scale', '15');
//     displacementMap.setAttribute('xChannelSelector', 'R');
//     displacementMap.setAttribute('yChannelSelector', 'G');

//     const gaussianBlur = doc.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
//     gaussianBlur.setAttribute('stdDeviation', '0.1');

//     filter.appendChild(turbulence);
//     filter.appendChild(displacementMap);
//     filter.appendChild(gaussianBlur);

//     defs.appendChild(filter);
//     g.setAttribute("filter", "url(#combined-filter)");

//     // Serialize the modified SVG back to a string
//     result = dom.serialize();
//   }
//   return result;
// }

// export function fixFalsePrecision(svg: string, places: number): string {
//   return svg.replace(/(\d+\.\d+)/g, (match, x) => {
//     const scale = Math.pow(10, places);
//     const roundedValue = Math.round(scale * parseFloat(x)) / scale;
//     return isNaN(roundedValue) ? match : roundedValue.toString();
//   });
// }

// export function formatXml(xml: string): string {
//   const formatted: string[] = [];
//   xml = xml.replace(/></g, '>\n<');
//   const reg = /(>)(<)(\/*)/;
//   xml = xml.replace(reg, '$1\r\n$2$3');
//   let pad = 0;

//   xml.split(/\r\n|\r|\n/).forEach((node) => {
//     let indent = 0;

//     if (node.match(/.+<\/\w[^>]*>$/)) {
//       indent = 0;
//     } else if (node.match(/^<\/\w/)) {
//       if (pad !== 0) {
//         pad -= 1;
//       }
//     } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
//       indent = 1;
//     } else {
//       indent = 0;
//     }

//     const padding = ' '.repeat(pad * 2);
//     formatted.push(`${padding}${node}`);
//     pad += indent;
//   });

//   return formatted.join('\n');
// }

// export function stripPreamble(svg: string) {
//   return svg.substring(svg.indexOf("<svg"));
// }