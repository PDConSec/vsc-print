# Using the Print extension

# Contents

1. [General use](#1)
2. [Customising your setup](#2)
3. [Markdown](#3)
4. [Troubleshooting](#4)

<a name="1"></a>

# General use

There are a couple of ways you can print or preview.

* You can print or preview the active document, by icon or context menu.
* You can print or preview a selection from the active document, by icon or context menu.
* You can print one or preview or more filse directly from the file explorer panel, by context menu on a folder, file or multi-selection of files.
* Files can be titled with their filepath. The title does not appear in the document but may be used in headers by some browsers.
  - You can choose from the following formats. 
    - No path
    - Abbreviated (like `D:\...\containing-folder\file.ext`)
    - Workspace relative 
* Files can have their filepath appear as a heading at the start of the document.
  - A setting determines whether to use relative or absolute file paths.
  - Non-workspace files always use absolute.
  - Absolute paths are converted to tilde paths when they are inside the user's home directory.
* A setting determines whether a file path heading appears at the start of individually printed files.
* Exclusion lists apply to both folder and file selections. The purpose of these is to ignore unprintable binary files.

Markdown documents can be rendered and styled. This is detailed in the Markdown section.

## Print the active document

To print the active document just click the printer icon to the right of the document tabs. Make sure you don't have multiple lines of text selected. Otherwise, you'll print the selection, not the whole document. **Control for paper size, margins and page orientation is in the print dialog.**

## Print a selection in the active document

Select a multi-line block of text in the active document. Then either click the printer icon to the right of the document tabs or right-click on the selection and choose `Print` from the context menu. When the context menu appears, `Print` appears at (or near) the top, the bottom or nowhere depending on the setting `Print: Editor Context Menu Item Position` .

Line numbers in your printout are aligned with the line numbers in the editor whether these are visible or not. So if you are discussing a line of code numbered 1145 in a code review and you open the file to amend it, typing `Ctrl+G` and then 1145 `[Enter]` will put your cursor directly on the line of code in question.

## Print a file without opening it

To print a file other than the active document, find it in the EXPLORER pane and right-click on it. In the file context menu `Print` always appears at or near the top of the menu. This prints the entire file.

## Print all the files in a folder

If you press `F1` and type `print folder` you will find that you can print all the printable files in the folder that contains the active document. A single print job is created with all the files separated by headings showing their names.

<a name="2"></a>

# Customising your setup

Most of these settings customise the user experience (icon, menu location etc). To find these settings, open VS Code's settings pane and either navigate to Extensions/Printing or just search for "printing".

Here is a list of available setting names as they appear in the configuration file.

* `print.alternateBrowser` : enable/disable an alternate browser
* `print.browserPath` : the path to a web browser
* `print.colourScheme` : the stylesheet used for colouring syntax
* `print.editorContextMenuItemPosition` : the position of `Print` in the editor context menu
* `print.editorTitleMenuButtonPrint` : show print button in the editor title menu
* `print.editorTitleMenuButtonPreview` : show preview button in the editor title menu
* `print.fontSize` : the font size (options from 6 to 13 pt)
* `print.formatMarkdown` : render Markdown as styled HTML when printing
* `print.lineNumbers` : on, off or inherit (from editor)
* `print.lineSpacing` : single, line-and-a-half or double spaced
* `print.folder.include`: pattern for files to include. Empty matches everything.
* `print.folder.exclude`: patterns to exclude
* `print.folder.maxFiles`: the maximum number of files for which content is rendered when printing a folder
* `print.folder.maxLines`: files containing more lines than this threshold will be ignored
* `print.logLevel`: controls the level of detail going into the log file
* `print.filepathAsDocumentHeading`: controls use of the file path as a heading at the start of a document
* `print.filepathAsDocumentTitle`: controls use of the file path as a document title (used by some browsers in the page header)
* `print.filepathHeadingForIndividuallyPrintedDocuments`: controls whether the file path header appears at the start of individually printed documents

## Customising the user interface

You can control whether the print and preview icons appear in the toolbar when you focus an editor pane. This setting is labelled `Editor Title Menu Button`.

You can control whether the "Print" menu item appears at the top, bottom or nowhere on context menus using the `Editor Context Menu Item Position` setting.

## Using a particular browser to print

**At the time of this release, problems with command routing were causing printing from remote workspaces to fall back to using the default printer. Full service will be restored as soon as possible.**

By default, printing will use your default browser. However, printing works best with a Chromium derived browser, and it may not be possible or desirable to change your default browser. 

To allow you to print using a browser that isn't your default browser, you can specify a path to an alternate browser, and there is also a checkbox to allow you to switch this on and off without losing the path.

These settings are labelled `Browser Path` and `Alternate Browser` respectively.

The path to the alternate browser is auto-quoted on Windows, and on Unix based platforms the spaces are escaped. Unfortunately this is incompatible with supplying command-line options.

If you need to supply command-line options, create a batch file (or a bash script file) that specifies the options, and refer to the bash script file in your alternate browser path.

## Printing source code

No, you can't have the same syntax colouring scheme as the editor. For starters many people use dark mode. A dark mode colour scheme won't work on white paper. Even if it did, VS Code does not make this information accessible through any API. It's impossible, and even if we could do it we still wouldn't discriminate against people who use dark mode.

Using the `Colour Scheme` setting you can specify the colour scheme used for syntax colouring. Choices are limited to light themes because printers use white paper. 

If you print the active document and there is a multi-line selection, only the selection is printed.

### Type face and size

Typeface is determined by VS Code editor settings. If you see Fira Code on screen, that's what will be printed. 

The _size_ of printed text is a Print setting because the size that works best on screen may not be the size that works best on paper. 

## Printing Markdown

You probably want Markdown print-jobs rendered and styled, and this is the default behaviour. If you wish to print Markdown as source code, you can un-check the setting `Print: Render Markdown`. For a variety of reasons we no longer use the VS Code Markdown rendering pipeline. This means that any Markdown extensions you may install will have no effect on print or print preview, only on the internal Markdown preview.

Just use print preview. We have off-line support for about thirty diagram types (see the Markdown section for details).
### Colour scheme

For source code printing, stylesheets are bundled and can be chosen by name from a list. Choices are limited to light stylesheets because printer paper is white and printer inks and toners are designed for white paper.

<a name="3"></a>

# Markdown

## KaTeX

Mark both the start and end of KaTeX notation using `$$`. The presence of a line break between the boundary markers will induce display mode. KaTeX blocks that do not contain a line break are rendered inline.

## Embedded diagrams

**[Set up a private Kroki server first.](https://docs.kroki.io/kroki/setup/install/)** 

* There's no charge
* The public server is rate limited
* No rate limit = hot preview for diagrams

The following diagram types are supported. 

|            |            |                  |              |             |          |
|------------|------------|------------------|--------------|-------------|----------|
| BlockDiag  | BPMN       | Bytefield        | SeqDiag      | ActDiag     | NwDiag   |
| PacketDiag | RackDiag   | C4 with PlantUML | D2           | DBML        | Ditaa    |
| Erd        | Excalidraw | GraphViz         | KaTeX        | Mermaid     | MHCHEM   |
| Nomnoml    | Pikchr     | PlantUML         | SmilesDrawer | Structurizr | Svgbob   |
| Symbolator | Tikz       | UMLet            | Vega         | Vega-lite   | WaveDrom |
| WireViz    | Database   |                  |              |             |          |

In all cases you use a fenced block annotated with the diagram name. Details the the syntax for the various diagram types can be found on the web by searching for the diagram names, with the exception of `Database`.

In the fenced block for `Database` you supply a connection string and some settings. Print uses this to connect to your database and extract the metadata to construct a Mermaid Entity Relationship diagram.

Print has a persistent cache (similar to a browser) for diagrams embedded in Markdown. Diagrams are rendered once, until you change them. Extending Kroki in the spirit of `jebb.plantUml` there is also support for recursive `!include filename.ext`.

### SMILES

You can supply just a SMILES string as the only content of the fenced block, or use YAML notation to specify image dimensions or SmilesDrawer config. Supported values are as follows.

  - smiles: <string> (required)
  - width: <number><px|em> (optional)
  - height: <number><px|em> (optional)
  - terminalCarbons: true|false (optional)
  - compactDrawing: true|false (optional)
  - explicitHydrogens: true|false (optional)
  - kekulise: true|false (optional)
  - aromatic: true|false (optional)
  - showTitle: true|false|<string> (optional, true/false to show/hide; true shows the SMILES string as the title, string for custom title)
  - showStereo: true|false (optional)
  - showAtomIds: true|false (optional)
  - showBondIds: true|false (optional)
  - background: <color> (optional)
  - colorAtoms: true|false (optional)
  - colorBonds: true|false (optional)

### Database diagrams

Like most diagrams you use a fenced block annotated with the diagram type. The content of this block must be valid YAML and the minimum you can specify is the `DatabaseType` and the `ConnectionString`.

#### Supported database types

 - Postgres
 - Microsoft SQL Server
 - MySql

Why don't we support Oracle? We the contributors don't use it. If you want it, become a contributor.

The syntax of the connection string depends on the database type. The samples below illustrate connection strings for each supported database engine.

You can specify the level of detail.

 - tables (a true ER diagram)
 - keys (just the PK and FKs)
 - columns (all the columns with their types)

Finally, you can specify which tables you want in the diagram. You can specify the schema, the syntax for which depends on the database engine (whatever you'd use in SQL). You can also list the tables you want included. If you don't specify this you'll get all the tables in the schema. If you don't specify a schema you'll get the default schema. If you don't specify either you'll get all the tables in the default schema.

What about credentials? This depends on the database server. For Microsoft SQL Server you can put them in the connection string or use a trusted connection. For Postgres you can put the username in the URL. See the database documentation for supported ways of supplying a password or avoiding the need to supply one.

#### Postgres

````
```database
DatabaseType: postgresql
ConnectionString: postgres://postgres:admin@localhost:5432/postgres 
Schema: public
Detail: keys
```
````

#### Microsoft SQL Server

````
```database
DatabaseType: mssql
ConnectionString: Server=localhost,1433; Database=OrderManagementDb; User Id=sa; Password=yourStrong(!)Password;
Schema: dbo
Tables: 
  - OrderStates
  - OrderHeaders
  - OrderItems
  - StockItems
Detail: keys
```
````

#### MySql

````
```database
DatabaseType: mysql
ConnectionString: mysql://root:admin@localhost:3306
Schema: hospital_db
Detail: keys
```
````

## Styling your markdown

### Apply CSS files to a Markdown document 

 - You can embed a stylesheet link tag directly into the Markdown. This is specific to the document.  
 - There's a setting called `markdown.styles`. This is a list of URLs. Both the built in Markdown preview and Print will honour this list. You can use absolute URLs, workspace relative URLS, or document  relative URLs, as shown in the following example.

```json
"markdown.styles": [
  "workspace.resource/path/to/stylesheet.css"
]
```

Workspace relative URLs are the best way to share resources between documents. They are in the workspace so they can be source controlled along with the documents, and because the URL is relative to the workspace rather than the document you can organise (and reorganise) documents in folders without breaking the URLs. Note that this applies not only to stylesheets but also to image file resources.

### Associating a style with Markdown

Mapping from Markdown to generated HTML is obvious. Tables become `table`, `th` and `td` elements. Headings are `H1` to `H9`. Paragraphs are `P` elements, bullets and numbers are `ul` and `ol` elements. 


Don't forget that you can embed HTML in Markdown, so there's nothing stopping you from using `div` or `span` to apply a CSS class to a block or run of Markdown.

## Web Server

The embedded web server binds only to the loopback address and accepts only connections that specify a current session identifier. A separate session is spun up for each print job and terminates when printing finishes. 

<a name="4"></a>

# Troubleshooting

## Prerequisites

* Start by making sure you can print a web page from your browser.
* The user as which VS Code runs must be able to establish a listening socket.

## First launch hassles

* Nothing seems to happen &mdash; restart VS Code.
* Browser launches but no page loads &mdash; check networking permissions.
* Browser shows an error message about not finding a CSS file &mdash; you installed from a VSIX that wasn't prepared by us. Get the [official package](https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print) and try again.

If something else is wrong, or you have an improvement idea, we invite you to log an issue on the GitHub repository.

## Choice of browser

The browser used will affect your experience.

### Recommended for printing

For best printing results, install Firefox or a Chromium based browser. If you don't want to make this your default browser, take advantage of the alternate-browser settings. **At the time of this release, problems with command routing were causing printing from remote workspaces to fall back to using the default printer. Full service will be restored as soon as possible.**

The following are known to work well.
* Brave
* Chromium
* Chrome
* Edge
* Firefox

### NOT recommended for printing

* Edge Classic is no longer supported.
* Internet Explorer is not supported.
* Safari does not work 
  - launched as an alternate browser it borks URLs
  - it won't use local fonts other than system fonts

If you enable `Use alternate browser` but you don't set the path, Print will scan all the default paths for common browsers and offer a list of the browsers it finds. Except for Safari - don't use Safari.

If you know you have a browser installed but it doesn't show up, most likely you didn't install it in the default location, or maybe the default location has changed. In that case, please 

1. Determine the actual location and name of the executable file. Apple users, pay attention: **not the app folder, the executable _file_ inside it.**
2. Manually set the alternate browser path to get your system working.
3. Raise an issue telling us the browser, the version you have and the full path so we can add it to the list of paths to check.

## Markdown extensions are not supported

Print uses its own pipeline because Microsoft keeps changing VS Code's Markdown rendering pipeline without notice. As a result it cannot use Markdown extensions. However, you will find that for Print, 
 - most of the worthwhile Markdown extensions are baked-in
 - we are receptive to special requests
 - this allows us to resolve conflicts between extensions.

## Alternate browser

**At the time of this release, problems with command routing were causing printing from remote workspaces to fall back to using the default printer. Full service will be restored as soon as possible.**

### Set the alternate browser by choosing from installed browsers

Press `F1` (or `Cmd+Shift+P` on a Mac) and type `Set Alternate Browser` then press `Enter` to run the command. Print will check the default locations for common browsers and offer a list of the browsers it found installed.

If you know you have a browser installed but it doesn't show up, most likely you didn't install it in the default location, or maybe the default location has changed. In that case, please 

1. Determine the actual location and name of the executable file. Apple users, pay attention: **not the app folder, the executable _file_ inside it.**
2. Manually set the alternate browser path to get your system working.
3. Raise an issue telling us the browser, the version you have and the full path so we can add it to the list of paths to check.


You cannot supply command-line options on the alternate browser path. On Windows, we automatically put quotes around your path in case of spaces in file or folder names. On other platforms, spaces are automatically escaped.

Both auto-quoting and escaping of spaces are incompatible with the use of command line options. The solution is to create a batch file (or shell script) that launches the browser with command line options, and supply the path to the batch file (or shell script).

### Chrome and plugins

Chrome may retain your printer, paper size and margin selections between print jobs. Some Chrome command line options cause errors to be reported, even though printing succeeds. 

Some Chrome plugins interfere with print job styling. While it is possible to suppress plugins with `--disable-plugins` this doesn't work when there is already a running instance of Chrome. The `--incognito` switch suppresses plugins when there is a running instance, but has its own problems.

## Reporting a problem

If you _still_ can't get Print to work, [raise an issue on the repository](https://github.com/PDConSec/vsc-print/issues). We'll try to help you.

We may ask you to crank up your logging level, reproduce the problem and then send us the log.

### Logging

Set the logging level with the `Print: Log Level` setting. This defaults to `error` (minimal logging) but you can turn it all the way up to `debug` which is very detailed, or even `silly` which will even log calls to the garbage collector.
