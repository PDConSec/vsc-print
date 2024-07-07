![source](assets/print-icon.png)

Print code. Print rendered Markdown. Local or remote. Windows, Mac or Linux.

## This release

We stopped using VS Code's rendering pipeline for Markdown because Microsoft continues to evolve it in ways that clash with the needs of printing. Because it's not a published API, there is no announcement of breaking changes and no consideration of third party needs. So last release we switched to our own. There are lots of extensions that extend Markdown rendering for the built-in pipeline, but many of them were broken already for Print so we forged ahead - and promptly heard cries of protest from Kroki users.

Kroki is server-based. Normally we won't do anything that can't work offline, but there were two compelling factors

*   it unifies a huge list of diagram engines
*   it _can_ work off-line: install Kroki server on your network or notebook

So while there was a drop in functionality for 0.12.3, with this release you can use the following:

|            |            |                  |              |             |          |
|------------|------------|------------------|--------------|-------------|----------|
| BlockDiag  | BPMN       | Bytefield        | SeqDiag      | ActDiag     | NwDiag   |
| PacketDiag | RackDiag   | C4 with PlantUML | D2           | DBML        | Ditaa    |
| Erd        | Excalidraw | GraphViz         | KaTeX        | Mermaid     | MHCHEM   |
| Nomnoml    | Pikchr     | PlantUML         | SmilesDrawer | Structurizr | Svgbob   |
| Symbolator | Tikz       | UMLet            | Vega         | Vega-lite   | WaveDrom |
| WireViz    |            |                  |              |             |          |

## Cross-platform printing

Print-jobs are rendered as styled HTML and served from an embedded webserver. Your local web browser is launched to load the print-job and give you printing options like paper size, page orientation and margin size.

So if you have a local browser that can print, and VS Code can launch it, you can print.

## Source code

![source](assets/source.png)

## Markdown

Use fenced blocks for LaTeX and Mermaid diagrams. You can position Mermaid diagrams by wrapping them in a div with the class `left`, `right`, `centre` or `fill`. Similar support for LaTeX will come in a later release.

![Markdown-rendered](assets/Markdown-rendered.png)

## Classic user experience

The print and print preview icon are on the toolbar _when there is an active editor_. VS Code shows extension contributions according to the language of the active editor. No active editor means no icons (someone thought we should "fix" this).

![toolbar](assets/print-icon.png)

If you have a text selection that crosses at least one line-break you can right click and choose `Print` or `Print preview` from the context menu to send just the selection to the printer. In the absence of a multi-line selection the entire document is printed. You can control the position of `Print` and `Print preview` in this menu, or remove it altogether.

![context-menu-editor](assets/context-menu.png)

Or you can right-click on a file in the file explorer pane and choose `Print` or `Print preview` from the context menu.

## Highly configurable

There are a number of settings. Most of them you just need to read the descriptions on the settings page, but we're old school and [we wrote a manual.](doc/manual.eng.md) If things aren't going well, consider reading it. If you have first-use problems, the manual contains a [troubleshooting guide](doc/manual.eng.md#troubleshooting).

Some things you can configure:

*   the colour scheme used for syntax colouring
*   whether or not you want line numbers
*   alternate browser for printing
*   line spacing (leave yourself more room for handwritten annotation of code)

## Planned changes

* The manual needs a rewrite, 
  - how to embed diagrams
  - how to control the flow of text around embedded diagrams
  - summary extracts of documentation so you don't have to hunt
* Machine translation to support major languages.  
  This has already been applied to the extension and its settings, but high quality automated translation of documentation is proving more difficult.
