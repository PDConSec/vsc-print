# How to add support for rendered printing 

> Requires vscode-print 0.10.10 or later.

If you can render a particular file format as styled HTML, it can be printed that way. CSS and image resources are supported.

The Print extension registers for *all* languages. When you select a document and click the Print icon, it tries to fetch the renderer for the `languageId` of the document. When there isn't one specific to that language, it uses the default renderer (the one that handles line-numbered syntax coloured source code). 

Renderers must support some callbacks: `getBodyHtml`, `getCssUriStrings`, `getResource` and `getTitle`. If the HTML you use doesn't require CSS files or images then you won't need to supply callbacks for `getCssUriStrings` or `getResource`.

This fully functional sample is based on the SVG format because the transformation of SVG to HTML is trivial and does not cloud the demonstration of

* Webpack bundling of the extension and any resources you need (images and stylesheets)
* How to define a setting to enable/disable rendering of your format when printing
* How to register with the Print extension when your extension activates

The sample doesn't implement `getTitle` because the default implementation is generally satisfactory. It returns a shortened filepath similar to `c:\...\folder\file.ext` or `.../folder/file.ext` depending on platform. The title is the name most web browsers show in the page header when printing. 

The project has `launch.json` and `tasks.json` preconfigured. After you clone the repo and run 

```
npm i
```

you can simply press `F5` and expect it to compile, bundle and run in the debugger.

## Getting started on your own extension

Use this project as the basis of your own extension so you don't have to fight with Webpack or tasks or launch configuration.

For your convenience the project is extensively marked with `// todo`. Some of these require corresponding changes in `package.json` so be sure to change that before you remove the todo (no comments in package.json).

For easy navigation through these annotations, install https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree

## More complex rendering 

The goal of the SVG sample was to teach you how to do all the supporting stuff that's irrelevant but vital. SVG was chosen precisely because it's a trivial transformation. 

Here's something meatier - this is how the default renderer applies syntax-colouring to source code. Mostly it's delegated to a third party library called [highlightjs](https://highlightjs.org). 

After that a line numbers are added, or not, depending on settings. Finally optional word breaks are inserted to improve the breaking of long spans of code that lack natural opportunities.

```ts
export function getBodyHtml(raw: string, languageId: string, options?:any): string {
	let renderedCode = "";
	try {
		try {
			renderedCode = hljs.highlight(raw, { language: languageId }).value;
		}
		catch (err) {
			renderedCode = hljs.highlightAuto(raw).value;
		}
		renderedCode = fixMultilineSpans(renderedCode);
		const printConfig = vscode.workspace.getConfiguration("print");
		const bpre = /([^ -<]{40}|\)\]\},)/g;
		if (printConfig.lineNumbers === "on") {
			renderedCode = renderedCode
				.split("\n")
				.map(line => line || "&nbsp;")
				.map((line, i) => `<tr><td class="line-number">${options.startLine + i}</td><td class="line-text">${line.replace(bpre, "$1<wbr>")}</td></tr>`)
				.join("\n")
				.replace("\n</td>", "</td>")
				;
		} else {
			renderedCode = renderedCode
				.split("\n")
				.map(line => line || "&nbsp;")
				.map((line, i) => `<tr><td class="line-text">${line.replace(bpre, "$1<wbr>")}</td></tr>`)
				.join("\n")
				.replace("\n</td>", "</td>")
				;
		}
	} catch {
		logger.error("Markdown could not be rendered");
		renderedCode = "<div>Could not render this file.</div>";
	}
	return `<table class="hljs">\n${renderedCode}\n</table>`;
}
```
## Why is SVG broken in the editor?

Registering the languageId `svg` and associating the `.svg` file type with the SVG language means that files with an svg extension are no longer treated as XML. While there are ways to handle this problem they are non-trivial and well out of scope for this demonstration.
