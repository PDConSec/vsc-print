# Using the Print extension

[English version](https://github.com/PeterWone/vsc-print) by Peter Wone

[ENGLISH](../MANUAL.md) | [FRANCAISE](../MANUAL.fra.md) | [DEUTSCH](../MANUAL.deu.md) | [ESPAGNOLE](../MANUAL.esp.md) | [中文CHINESE](../MANUAL.zho.md) | [Add a language](how-to-add-a-language.md)

# Contents

1. [General use](#general-use)
2. [Customising your setup](#customising-your-setup)
3. [Markdown](#markdown)
4. [Markdown extensions and remote workspaces](#markdown-extensions-and-remote-workspaces)

# General use

There are a couple of ways you can print.

* You can print the active document, by icon or context menu.
* You can print a selection from the active document, by icon or context menu.
* You can print a file directly from the file explorer panel,  without opening the file first, by context menu.
* You can print all the files in a folder subject to exclusion lists.

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
* `print.folder.maxLines`: files containing more lines than this threshold will be ignored
* `print.logLevel`: controls the level of detail going into the log file

## Customising the user interface

You can control whether the print icon appears in the toolbar when you focus an editor pane. This setting is labelled `Editor Title Menu Button`.

You can control whether the "Print" menu item appears at the top, bottom or nowhere on context menus using the `Editor Context Menu Item Position` setting.

When the `Print and Close` setting is checked, printing something will automatically open the browser's Print dialog and then automatically close the browser after you either print or cancel. Turning this off will open the browser with the rendered document ready for inspection. If you then manually open the Print dialog, printing or cancelling it will not close the browser.

## Using a particular browser to print

By default, printing will use your default browser. However, printing works best with a Chromium derived browser, and it may not be possible or desirable to change your default browser. 

To allow you to print using a browser that isn't your default browser, you can specify a path to an alternate browser, and there is also a checkbox to allow you to switch this on and off without losing the path.

These settings are labelled `Browser Path` and `Alternate Browser` respectively.

The path to the alternate browser is auto-quoted on Windows, and on Unix based platforms the spaces are escaped. Unfortunately this is incompatible with supplying command-line options.

If you need to supply command-line options, create a batch file (or a bash script file) that specifies the options, and refer to the bash script file in your alternate browser path.

## Printing source code

Using the `Colour Scheme` setting you can specify the colour scheme used for syntax colouring. Choices are limited to light themes because printers use white paper. 

While it is possible to use a dark theme and just set the back

### Type face and size

Typeface is determined by VS Code editor settings. If you see Fira Code on screen, that's what will be printed. 

The _size_ of printed text is a Print setting because the size that works best on screen may not be the size that works best on paper. 

## Printing Markdown

You probably want Markdown print-jobs rendered and styled, and this is the default behaviour. If you wish to print Markdown as source code, you can un-check the setting `Print: Render Markdown` .

### Colour scheme

For source code printing, stylesheets are bundled and can be chosen by name from a list. Choices are limited to light stylesheets because printer paper is white and printer inks and toners are designed for white paper. 



Line spacing and font size settings are available for source code. 

There are limits to the inference of syntactical context when applying the syntax colouring engine (highlight.js) to a selection. You can often improve this by expanding the selection to include things like function headers.

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

# Markdown extensions and remote workspaces

To work with remote workspaces a Markdown extension must run on the remote host because that's where the Markdown rendering pipeline runs. Most Markdown extensions are capable of working like this but they are not set up for it.

Trouble is, most of them aren't set up this way even though all it would take is a single entry in their `package.json` file. 

Fortunately, you can patch them yourself. 

1. Find the extensions where they are installed on your workstation in `~/.vscode/extensions` (on Windows substitute `%userprofile%` for `~`)
2. Edit the `package.json` files for the Markdown extensions you want to use on remote hosts. Add the `extensionKind` attribute. 
3. When you've edited all the Markdown extensions restart VS Code.

It's a root level attribute so you can put it right at the start. If this attribute is already present, VS Code will soon tell you. To work properly with a remote host it must specify "workspace". Do not list both `workspace` and `ui`. If you do that VS Code will prefer the local workstation and it will function locally but fail for remote workspaces. 
You need it to be determined by the workspace. 

What if you have a remote workspace, but one editor contains a local file? When that local file is source code, printing will work. For Markdown that is free of resource references, printing will work. But Markdown references to images will resolve in the remote filesystem and the images will not be found.


```json
{
  "extensionKind": [
    "workspace"
  ],
  "name": "vscode-print",
  "displayName": "Print",
  ...
```
You may also need to make the same change to the `package.json` in the installation on the remote host.
