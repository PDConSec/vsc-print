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

There are a number of settings. Most of them you just need to read the descriptions on the settings page, but we're old school and [we wrote a manual.](doc/manual.eng.md) If things aren't going well, consider reading it. If you have first-use problems, the manual contains a [troubleshooting guide](doc/manual.eng.md#troubleshooting).

Some things you can configure:

- the colour scheme used for syntax colouring
- whether or not you want line numbers
- alternate browser for printing
- line spacing (leave yourself more room for handwritten annotation of code)

## Planned changes

- Machine translation to support major languages.
This has already been applied to the extension and its settings but high quality automated translation of documentation is proving more difficult.
- Our own `marked` based Markdown rendering pipeline. We used the VS Code internal rendering pipeline in order to pick up any Markdown extensions that you might have installed for use with the internal Markdown preview. Microsoft does not support use of the internal pipeline and has no compunction about making unannounced breaking changes to it, so we will be our own renderer. Long experience shows that there are only a handful of widely used Markdown extensions so we plan to bake them in.
