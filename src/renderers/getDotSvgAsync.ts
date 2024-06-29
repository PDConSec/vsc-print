import { instance as VIZ, Viz } from "@viz-js/viz";

let viz: Viz;

export async function getDotSvgAsync(dot: any, options: any) {
  viz = viz ?? await VIZ();
  return viz.renderSVGElement(dot, options).outerHTML;
}
