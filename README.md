![source](assets/print-icon.png) 

Print code. Print rendered Markdown. Local or remote. Windows, Mac or Linux.

## Cross-platform printing

Print-jobs are rendered as styled HTML and served from an embedded webserver. Your local web browser is launched to load the print-job and give you printing options like paper size, page orientation and margin size. 

So if you have a local browser that can print, and VS Code can launch it, you can print.

## Source code

![source](assets/source.png) 

## Markdown

![Markdown-rendered](assets/Markdown-rendered.png) 

## Classic user experience

The print icon on the toolbar prints the document in the active editor.

If you have a text selection that crosses at least one line-break you can right click and choose `Print` from the context menu to send just the selection to the printer. In the absence of a multi-line selection the entire document is printed. You can control the position of `Print` in this menu, or remove it altogether.

![context-menu-editor](assets/context-menu.png)

Or you can right-click on a file in the file explorer pane and choose Print from the context menu.

![context-menu-file-explorer](assets/tree-context-menu.png)

## Highly configurable

There are a number of settings. Most of them you just need to read the descriptions on the settings page, but we're old school and [we wrote a manual.](doc/manual.eng.md) If things aren't going your way, maybe you should read it. If you have first-use problems, the manual contains a [troubleshooting guide](doc/manual.eng.md#troubleshooting).

Some things you can configure:

- the colour scheme used for syntax colouring
- whether or not you want line numbers
- alternate browser for printing
- line spacing (leave yourself more room for handwritten annotation of code)

## Extensible

As of version 1.0.0 Print exports an API that allows another extension to register for print and preview services.

The Print SDK includes a complete worked example that demonstrates how to
* Register for preview and print services for SVG files
* Embed resources (like CSS and image files) in the extension's Webpack bundle
* Extract those resources from your extension's Webpack bundle into cache ready to service requests for them.
* Use bundled resources in generated HTML
* Register a "Preview" command forwarding the request to the Print extension
* Handle rendering of SVG into styled HTML

The sample is annotated with `// todo` comments to help you use it as the basis of your own extension. Webpack bundling is already set up including the customisation required for you to embed textual and binary resources and demonstrations of how to load them from the bundle into your cache for delivery.
