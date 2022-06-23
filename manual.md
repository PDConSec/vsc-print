# Visual Studio Code Printing

[English version](https://github.com/PeterWone/vsc-print) by Peter Wone

[ENGLISH](manual.md) | [FRENCH](manual.fra.md) | [GERMAN](manual.deu.md) | [Add a language](how-to-add-a-language.md)

## Printing

### Setup to print on a remote host

You have to install the Print extension on the target system. If the target host is your workstation, no further action is required, but when the target host is a remote host, you must also install the Print extension on the remote host. 

1. Connect to the remote host
2. Click on the extensions icon at the left border of the VS Code UI. 
3. Find the Print extension. 
4. It should have a little badge on it offering to install on the remote host. Click the badge and VS Code will take it from there.

You have to do this again for each different remote host to which you connect (different Docker containers, for example).

Markdown extensions also need to be installed on the target host if you want to use them.

### Print the active document

To print the active document just click the printer icon to the right of the document tabs. Control for paper size, margins and page orientation is in the print dialog.

### Print a selection in the active document

Select at least one line in the active document. Then either click the printer icon to the right of the document tabs or right-click on the selection and choose `Print` from the context menu. When the context menu appears, `Print` appears at (or near) the top, the bottom or nowhere depending on the setting `Print: Editor Context Menu Item Position` .

Line numbers in your printout are aligned with the line numbers in the editor whether these are visible or not. So if you are discussing a line of code numbered 1145 in a code review and you open the file to amend it, typing `Ctrl+G` and then 1145 `[Enter]` will put your cursor directly on the line of code in question.

### Print a file without opening it

To print a file other than the active document, find it in the EXPLORER pane and right-click on it. In the file context menu `Print` always appears at or near the top of the menu. This prints the entire file.

## Print all the files in a folder
If you press `F1` and type `print folder` you will find that you can print all the files in the folder that contains the active document. A single print job is created with all the files separated by headings showing their names.

## Settings

This extension has the following settings, which can be modified by going to Code > Preferences > Settings > Extensions > Printing:

* `print.alternateBrowser` : enable/disable an alternate browser
* `print.announcePortAcquisition` : make the embedded web server tell you what port it uses
* `print.browserPath` : the path to a web browser
* `print.colourScheme` : the stylesheet used for colouring syntax
* `print.editorContextMenuItemPosition` : the position of `Print` in the editor context menu
* `print.editorTitleMenuButton` : show print button in the editor title menu
* `print.fontSize` : the font size (options from 6 to 13 pt)
* `print.formatMarkdown` : render Markdown as styled HTML when printing
* `print.lineNumbers` : on, off or inherit (do same as editor)
* `print.lineSpacing` : single, line-and-a-half or double spaced
* `print.printAndClose` : after printing, close the browser
* `print.webserverUptimeSeconds` : number of seconds to keep the web server running
* `print.folder.include`: pattern for files to include. Empty matches everything.
* `print.folder.exclude`: patterns to exclude
* `print.folder.maxLines`: files containing more lines than this threshold will be ignored

### Type face and size

Typeface is determined by VS Code editor settings. If you see Fira Code on screen, that's what will be printed. 

The _size_ of printed text is a Print setting because the size that works best on screen may not be the size that works best on paper. 

#### A note on nomenclature

A font defines *all* of the following:
* **typeface** eg Consolas or Fira Code
* **treatment** eg italic
* **weight** eg 700 (bold)
* **size** eg 12pt

"Fira Code" is a typeface, not a font. "Fira Code 12pt Bold" is a font. Italic is a _treatment_ and Bold is a _weight_. Yes, I know you download font files. In the days before TrueType there was a separate file per size and treatment combination and it really was a font file. "Scalable font" is a contradiction in terms. 

#### If you want a font size other than the sizes listed in the picker
1. Change the size using the picker to conveniently create an entry in the settings.
2. Edit the settings as JSON and type some other size, taking care not to mess up the units.

## Markdown

You probably want Markdown print-jobs rendered and styled, and this is the default behaviour. If, for your own ineffable reasons, you wish to print the raw text, you can un-check the setting `Print: Render Markdown` .

## Alternate browser

You can print with a browser other than your default browser.

Why would you want to do that?

* Chromium, Edge Dev and Chrome are the only browsers that close properly after printing. This makes them the best choices for printing, but you may have a different preference for daily web use.
* This can be handy for troubleshooting. Perhaps you are crafting your own stylesheet and want to be able to stop the browser from closing after printing so you can inspect on-screen.
* Some other reason of your own that I can't imagine.

To set up an alternate browser you must do two things:

1. Supply the path to the browser executable in the `Print: Browser Path` setting. On Windows it might be something like `C:\Program Files (x86)\Google\Chrome\Application\Chrome.exe`
1. Enable/disable the alternate browser using the setting `Print: Alternate Browser`

## Choose a colour scheme for source code printing

For source code printing, stylesheets are bundled and can be chosen by name from a list. Choices are limited to light stylesheets because paper is white. For rendered Markdown, customisation via CSS files has returned.

## Styling your markdown

The _recommended_ way to handle stylesheets is as follows.

* For styling specific to a particular document you can use relative URLs. Backpathing is supported provided the referenced file is in the workspace.
* You can reference a stylesheet that is served by a webserver. Obviously stylesheets served this way will be available only where the webserver is accessible.
* You can use a workspace-relative URL like this: `vsc-print.workspace/path/to/stylesheet.css`.

How do you reference a CSS file from a Markdown document? You don't. There's a setting called `markdown.styles`. This is a list of URLs. Both the built in Markdown preview and Print will honour this list.

```json
"markdown.styles": [
	"https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css",
	"vsc-print.workspace/path/to/stylesheet.css"
]
```

Workspace relative URLs are the best way to share resources between documents. They are in the workspace so they can be source controlled along with the documents, and because the URL is relative to the workspace rather than the document you can organise (and reorganise) documents in folders without breaking the URLs. Note that this applies not only to stylesheets but also to image resources.

## Web Server

The embedded web server allows connections only from localhost.  Connections from other hosts are rejected.

## Katex Markdown extension
This depends on CSS and fonts from the web. To get printing to work you must add the required stylesheet to your settings. If you find one or two things work in the preview yet not in print, determine the current version from the KaTeX website, and update the URL. 

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

```
