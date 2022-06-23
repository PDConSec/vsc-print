# Visual Studio Code Printing

[English version](https://github.com/PeterWone/vsc-print) by Peter Wone

[ENGLISH](manual.md) | [FRENCH](manual.fra.md) | [GERMAN](manual.deu.md) |
[中文CHINESE](manual.zho.md) |
[Add a language](how-to-add-a-language.md)

## 打印

### 在远程主机上设置

您必须在目标系统上安装打印扩展。如果目标主机是您的工作站，则无需进一步操作，但当目标主机是远程主机时，您还必须在远程主机上安装打印扩展。

1. 连接到远程主机
2. 单击 VS Code UI 左边框的扩展图标。
3. 找到打印扩展。
4. 它上面应该有一个按钮，可以安装在远程主机上。单击安装，VS Code 将安装插件。

在每个新的主机上都需要重新安装。

如果您使用 Markdown 扩展，也需要在目标主机上安装它们。

### 打印文档

要打印活动文档，只需单击文档选项卡右侧的打印机图标。对纸张大小、边距和页面方向的设置位于打印对话框中。

### 选择需要打印的文档

在需要打印的文档中至少选择一行。然后单击文档选项卡右侧的打印机图标或右键单击选择 `Print` 。当右键菜单出现时 `Print` 会根据设置出现在顶部、底部（或者附近），相关设置`Print: Editor Context Menu Item Position`

打印输出中的行号与编辑器中的行号对齐，无论这些行号是否可见因此，如果您在代码审查中需要对行编号为 1145 的代码行打开并修改，按下 `Ctrl+G` 并且输入 1145 并回车，便可直接将光标停留在相关的代码上

### 打印文件但不打开

要打印当前文档以外的文件，请在“资源管理器”中找到它并右键单击它。在右键菜单中，`Print`总是出现在菜单顶部或附近。这将打印整个文件。

## 打印文件夹中的所有文件
如果按F1并输入print folder，您会发现可以打印包含活动文档的文件夹中的所有文件。创建一个打印任务，其中所有文件由显示其名称的标题区分。

## 设置

此扩展程序具有以下设置，可以通过 Code > Preferences > Settings > Extensions > Printing 修改设置:

* `print.alternateBrowser` : 启用/禁用备用浏览器
* `print.announcePortAcquisition` : 设置内置Web浏览器监听端口

* `print.browserPath` : 浏览器路径
* `print.colourScheme` : 用于着色语法的样式表
* `print.editorContextMenuItemPosition` : `Print`在编辑器右键菜单中的位置
* `print.editorTitleMenuButton` :  在编辑器标题菜单中显示打印按钮
* `print.fontSize` : 字体大小（6 ～ 13 pt）
* `print.formatMarkdown` : 打印时将 Markdown 渲染为样式化的 HTML
* `print.lineNumbers` : 开、关或继承行标数（与编辑器相同）
* `print.lineSpacing` : 1、1.5、2倍行间距
* `print.printAndClose` : 打印后关闭浏览器
* `print.webserverUptimeSeconds` : 保持网络服务器运行的秒数
* `print.folder.include`: 文件包含的模式。不设置则包含所有文件
* `print.folder.exclude`: 要排除的模式
* `print.folder.maxLines`: 包含比此值多的行数的文件将被忽略

### 字体和大小

字体由 VS Code 编辑器设置决定。如果您在屏幕上看到 Fira 代码，就会打印出来。

打印文本的大小是一个打印设置，因此，在屏幕上效果最好的尺寸，可能不是在纸上效果最好的尺寸。

#### 关于命名的说明

字体定义了以下所有内容：
* **typeface** 例如 Consolas 或 Fira Code
* **treatment** 例如斜体
* **weight** 例如 700（粗体）
* **size** 例如 12pt

"Fira Code" is a typeface, not a font. "Fira Code 12pt Bold" is a font. Italic is a _treatment_ and Bold is a _weight_. Yes, I know you download font files. In the days before TrueType there was a separate file per size and treatment combination and it really was a font file. "Scalable font" is a contradiction in terms. 

#### 如果您想要选择器中列出的字体大小以外的字体大小
1. 使用选择器更改大小以方便地在设置中创建条目。
2. 将设置编辑为 JSON 并键入其他大小，注意不要混淆单位。

## Markdown

您可能希望呈现和设置 Markdown 打印效果，这是默认行为。如果由于您自己的原因，您希望打印原始文本，您可以取消选中设置 `Print: Render Markdown` .

## 备用浏览器

您可以使用默认浏览器以外的浏览器进行打印。

Why would you want to do that?
译者复读：为啥你想那样呢？

* Chromium、Edge Dev 和 Chrome 是仅有的在打印后正常关闭的浏览器。这使它们成为打印的最佳选择，但您可能对日常 Web 使用有不同的偏好。
* 这对于故障排除非常方便。也许您正在制作自己的样式表，并希望能够在打印后阻止浏览器关闭，以便您可以在屏幕上进行检查。
* 你自己的其他一些我无法想象的原因。（译者：总有人B事儿多

要设置备用浏览器，您必须做两件事：

1. 在`Print: Browser Path`设置中提供浏览器可执行文件的路径。在 Windows 上，它可能类似于`C:\Program Files`
2. 设置启用/禁用备用浏览器 `Print: Alternate Browser`

## 选择配色方案

不再支持自定义样式表。可用的样式表是捆绑在一起的，可以从列表中按名称进行选择。选择仅限于浅色样式表，因为纸张是白色的。

## 网络服务器

Web 服务器只允许来自本地主机的连接。来自其他主机的连接被拒绝。

## Katex Markdown 扩展
这取决于来自网络的 CSS 和字体。要使打印工作，您必须将所需的样式表添加到您的设置中。如果您发现一两件事在预览中有效但尚未印刷，请从 KaTeX 网站确定当前版本，并更新 URL。

```json
"markdown.styles": [
  "https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"
]
```

以下是一些示例，可帮助您检查配置。
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

# Markdown 扩展和远程工作区

要使用远程工作区，Markdown 扩展必须在远程主机上运行，因为这是 Markdown 呈现程序运行的地方。大多数 Markdown 扩展都能够工作，但它们并没有为此特地设置。

问题是，它们中的大多数都不是这样设置的，即使只需要在它们的`package.json`文件中添加一个条目。

幸运的是，您可以自己修补它们。

1. 找到他们的工作站上安装的扩展~/.vscode/extensions（在Windows替代品%userprofile%的~）
2. 编辑package.json要在远程主机上使用的 Markdown 扩展的文件。添加extensionKind属性。
3. 编辑完所有 Markdown 扩展后，重新启动 VS Code。

它是一个根级属性，因此您可以将其放在开始。如果这个属性已经存在，VS Code 会很快告诉你。若要与远程主机一起正常工作，它必须指定“工作区”。不要同时列出workspace和ui。如果你这样做，VS Code 将优先本地工作站，它将在本地运行，但在远程工作区中失败。您需要它确定工作区。 
You need it to be determined by the workspace. 

如果您有一个远程工作区，但一个编辑器包含一个本地文件怎么办？当该本地文件是源代码时，打印生效。对于没有资源引用的 Markdown，打印生效。但是 Markdown 对图像的引用将在远程文件系统中解析，并且不会找到图像。


```json
{
  "extensionKind": [
    "workspace"
  ],
  "name": "vscode-print",
  "displayName": "Print",

```
