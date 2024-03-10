# Using the Print extension

# Contents

1. [General use](#1)
2. [Customising your setup](#2)
3. [Markdown](#3)
5. [Printing other formats rendered](#4)
6. [Troubleshooting](#5)

<a name="1"></a>

# General use

There are a couple of ways you can print.

* You can print the active document, by icon or context menu.
* You can print a selection from the active document, by icon or context menu.
* You can print one or more filse directly from the file explorer panel, by context menu on a folder, file or multi-selection of files.
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
* `print.editorTitleMenuButton` : show print button in the editor title menu
* `print.fontSize` : the font size (options from 6 to 13 pt)
* `print.formatMarkdown` : render Markdown as styled HTML when printing
* `print.lineNumbers` : on, off or inherit (from editor)
* `print.lineSpacing` : single, line-and-a-half or double spaced
* `print.printAndClose` : after printing, close the browser
* `print.folder.include`: pattern for files to include. Empty matches everything.
* `print.folder.exclude`: patterns to exclude
* `print.folder.maxFiles`: the maximum number of files for which content is rendered when printing a folder
* `print.folder.maxLines`: files containing more lines than this threshold will be ignored
* `print.logLevel`: controls the level of detail going into the log file
* `print.filepathAsDocumentHeading`: controls use of the file path as a heading at the start of a document
* `print.filepathAsDocumentTitle`: controls use of the file path as a document title (used by some browsers in the page header)
* `print.filepathHeadingForIndividuallyPrintedDocuments`: controls whether the file path header appears at the start of individually printed documents

## Customising the user interface

You can control whether the print icon appears in the toolbar when you focus an editor pane. This setting is labelled `Editor Title Menu Button`.

You can control whether the "Print" menu item appears at the top, bottom or nowhere on context menus using the `Editor Context Menu Item Position` setting.

When the `Print and Close` setting is checked, printing something will automatically open the browser's Print dialog and then automatically close the browser after you either print or cancel. Turning this off will open the browser with the rendered document ready for inspection. If you then manually open the Print dialog, printing or cancelling it will not close the browser.

## Using a particular browser to print

**At the time of this release, problems with command routing were causing printing from remote workspaces to fall back to using the default printer. Full service will be restored as soon as possible.**

By default, printing will use your default browser. However, printing works best with a Chromium derived browser, and it may not be possible or desirable to change your default browser. 

To allow you to print using a browser that isn't your default browser, you can specify a path to an alternate browser, and there is also a checkbox to allow you to switch this on and off without losing the path.

These settings are labelled `Browser Path` and `Alternate Browser` respectively.

The path to the alternate browser is auto-quoted on Windows, and on Unix based platforms the spaces are escaped. Unfortunately this is incompatible with supplying command-line options.

If you need to supply command-line options, create a batch file (or a bash script file) that specifies the options, and refer to the bash script file in your alternate browser path.

## Printing source code

Using the `Colour Scheme` setting you can specify the colour scheme used for syntax colouring. Choices are limited to light themes because printers use white paper. 

If you print the active document and there is a multi-line selection, only the selection is printed.

### Type face and size

Typeface is determined by VS Code editor settings. If you see Fira Code on screen, that's what will be printed. 

The _size_ of printed text is a Print setting because the size that works best on screen may not be the size that works best on paper. 

If you're wondering why we call it a typeface and not a font, it's because a font is a particular typeface in a specific size and treatment. "12pt Times italic" is a font. "Times" is a typeface. It does not help that the Windows Font Picker (which _does_ pick a font, you have to specify typeface, size and treatment) mislabels the typeface as "Font".

## Printing Markdown

You probably want Markdown print-jobs rendered and styled, and this is the default behaviour. If you wish to print Markdown as source code, you can un-check the setting `Print: Render Markdown` .

### Colour scheme

For source code printing, stylesheets are bundled and can be chosen by name from a list. Choices are limited to light stylesheets because printer paper is white and printer inks and toners are designed for white paper. 

# Markdown

## Styling your markdown

### Apply CSS files to a Markdown document 

* You can embed a stylesheet link tag directly into the Markdown. This is specific to the document.  
* There's a setting called `markdown.styles`. This is a list of URLs. Both the built in Markdown preview and Print will honour this list. You can use absolute URLs, workspace relative URLS, or document  relative URLs, as shown in the following example.

```json
"markdown.styles": [
	"https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css",
	"path/to/document/relative/custom.css",
	"workspace.resource/path/to/stylesheet.css"
]
```

Workspace relative URLs are the best way to share resources between documents. They are in the workspace so they can be source controlled along with the documents, and because the URL is relative to the workspace rather than the document you can organise (and reorganise) documents in folders without breaking the URLs. Note that this applies not only to stylesheets but also to image file resources.

### Associating a style with Markdown

Mapping from Markdown to generated HTML is obvious. Tables become `table`, `th` and `td` elements. Headings are `H1` to `H9`. Paragraphs are `P` elements, bullets and numbers are `ul` and `ol` elements. 


Don't forget that you can embed HTML in Markdown, so there's nothing stopping you from using `div` or `span` to apply a CSS class to a block or run of Markdown.

## Web Server

The embedded web server binds only to the loopback address and accepts only connections that specify.

## Katex Markdown extensions

Katex depends on CSS and fonts from the web. To get printing to work you must add the required stylesheet to your settings. If you find one or two things work in the preview yet not in print, determine the current version from the KaTeX website, and update the URL. 

```json
"markdown.styles": [
	"https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"
]
```
If you want to cut the cord, then import the Katex resources into your project as described in the preceding section and use a workspace-relative reference. 

Here are some samples to help you check your configuration.
```
$$
\begin{alignedat}{2}
   10&x+ &3&y = 2 \\
   3&x+&13&y = 4
\end{alignedat}
$$
and thus

$$
x = \begin{cases}
   a &\text{if } b \\
   c &\text{if } d
\end{cases}
$$
```

## Rendered Markdown and remote workspaces

To work with remote workspaces a Markdown extension must run on the remote host because that's where the Markdown rendering pipeline runs. Extensions like Print that are designed for use with remote workspaces can be deployed to the remote host with a single click. Most Markdown extensions are capable of working like this but they are not set up for it.

Unfortunately, Markdown extensions are not normally configured for remote use; the designers expected them to run locally. 

### DIY patching of Markdown extensions

If your need is urgent, you can patch extensions yourself. 

1. Find the extensions where they are installed on your workstation in `~/.vscode/extensions` (on Windows substitute `%userprofile%` for `~`)
2. Edit the `package.json` files for the Markdown extensions you want to use on remote hosts. Add the `extensionKind` as a root level attribute. 
3. When you've edited all the Markdown extensions restart VS Code.
4. Install the extension on the remote host and patch the extension on the remote host in the same way.

```json
...
"extensionKind": [
  "workspace"
],
...
```

Patches like this will be lost at the next update for an extension, so if your patch was successful you may want to submit a PR to the publisher.

# Printing other formats rendered

Issues have been logged requesting rendered printing of formats other than Markdown. Examples include sheet music from the ABC music markup, and Jupyter Notebooks. To support this without taking on the unmanageable burden of keeping up with every text based document format used with VS Code, we have exposed an API and published an SDK allowing the maintainers to incorporate printing into their preview capability.

As a result, if you would like rendered printing for a particular format for which you already have an extension providing preview, raise an issue with the publisher of that extension. Explain your desire to print and refer them for printing and referring them to 

<a name=""></a>

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

For best printing results, install a Chromium based browser or Firefox. If you don't want to make this your default browser, take advantage of the alternate-browser settings. **At the time of this release, problems with command routing were causing printing from remote workspaces to fall back to using the default printer. Full service will be restored as soon as possible.**

The following are known to work well.
* Brave
* Chromium
* Chrome
* Edge
* Firefox

### NOT recommended for printing

* Edge Classic is no longer supported.
* Internet Explorer is not supported.

## Markdown extensions and remoting

To use Print with a remote host, you must install it **on the remote host**. 

To get the benefit of a Markdown extension when printing a document from a remote host, the Markdown extension must be built with an `extensionKind` of `workspace` _and_ it must be installed to the remote host. 

Most such extensions are not built for `workspace`. They can be trivially fixed by modifying their `package.json`. Unfortunately this manual patch is likely to be lost whenever the extension is updated, so you should raise an issue with the author of extensions you patch.

## Alternate browser

**At the time of this release, problems with command routing were causing printing from remote workspaces to fall back to using the default printer. Full service will be restored as soon as possible.**

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
