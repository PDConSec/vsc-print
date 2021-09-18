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

## Choose a colour scheme

Custom stylesheets are no longer supported. Available stylesheets are bundled and can be chosen by name from a list. Choices are limited to light stylesheets because paper is white.

## Web Server

The web server allows connections only from localhost.  Connections from other hosts are rejected.

## Katex Markdown extension
This depends on CSS and fonts from the web. To get printing to work you must add the required stylesheet to your settings.

		"markdown.styles": [
			"https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css"
		]

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
