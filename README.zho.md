# <img width="64px" src="vscode-print-128.png"></img> Print

[商店页面](https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print)

[英语版本](https://github.com/PeterWone/vsc-print)由 Peter Wone 编写

[ENGLISH](README.md) | [FRENCH](README.fra.md) | [中文CHINESE](README.zho.md) | [Add a language](how-to-add-a-language.md)

大多数首次使用失败是由于第三方重新打包错误造成的。如果您遇到这种情况。请获取 [我们生产和测试的包装](https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print).

## 用于打印格式的 Markdown、源代码

* 打印 源代码
* 打印时 完全呈现Markdown
* 支持远程工作区

源代码支持行号显示和语法着色。 
Markdown 则使用 VS Code 的预览格式渲染 &mdash; 绝大多数 Markdown 扩展都支持打印

## 平台独立打印

打印内容将先转换为样式化的 HTML，并以内置 Web 服务器提供服务。打印时，您的内置Web浏览器会启动以支持打印，并且为您提供页面方向以及边距大小设置。因此，如果您有一个可以打印的本地浏览器，并且 VS Code 可以启动它，那么您就在做生意。已知的用户平台包括 Windows、Linux 和 OSX（译者：先已改名MacOS）。

### 首次启动时的故障排除

本插件已为超过五万人服务过, 但是有时本地的设置和权限管制会影响使用，此处列举了大多数人遇到的一些问题，以及处理方法，如果仍然出现了错误，或者您有更好的改进想法，我们诚恳的希望您在GitHub库中提交issue。

* 什么也没发生&mdash; 重启VSC
* 火狐浏览器有问题。安装 Chromium（或 Chrome、Edge、Brave...）并将其设置为默认浏览器或将打印扩展程序配置为使用特定浏览器 (RTFM)。
*浏览器启动但没有页面加载 - 检查网络权限。
* 浏览器显示一条关于未找到 CSS 文件的错误消息 &mdash; 也许您并不是从官方商店获取的包 [获取官方包](https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print) 并且重试。


## 经典用户体验

![Toolbar snap with print icon](https://user-images.githubusercontent.com/5498936/53408273-d853d480-3a09-11e9-8936-d37189dce8c5.PNG)

工具栏中包含有打印图标，您可以点击它以在活动编辑器中打印文档。

如果您有一个文本选择跨越至少一个换行符，您可以右键单击并 `Print` 从上下文菜单中选择以将选择发送到打印机。如果没有多行选择，则打印整个文档。您可以在 菜单中的`Print` 设置它的位置，或者移除它。

![context-menu-editor](https://user-images.githubusercontent.com/5498936/53408378-05a08280-3a0a-11e9-8e88-0088089e0d07.png)

或者，您可以右键单击文件资源管理器中的文件，然后从菜单中选择打印。

![context-menu-file-explorer](https://user-images.githubusercontent.com/5498936/53408376-05a08280-3a0a-11e9-9912-31e869db64d5.png)

## 特点

在 Mac、Linux 和 Windows 上打印

* 完全本地化运行，不依赖云服务（第三方Markdown扩展可能引入远程依赖）
* 各种常见的配色方案的语法着色
* 可以选择行编号
* 可调行距（1、1.5、2）
* 打印编辑器中指定行编号的代码
* 可以使用指定浏览器以外的浏览器
* 在打印 Markdown 文档的时候，以 Markdown 形式显示（或者不以此中方式显示，可以在设置中开关）
* 适用于 SSH、WSL 和 Docker 容器的 Microsoft 远程主机扩展

## 使用要求

* 您需要一个可以访问打印机的网络浏览器。Firefox不是一个理想的选择，但如果您更喜欢将其作为默认浏览器，那么您会很高兴地了解到，您可以将打印配置为使用非默认浏览器 &mdash; 您可以在打印时使用它。
* T运行 VS Code 的用户必须能够建立一个监听套接字。

## 质量控制

本软件仅使用 Microsoft 发布的 Visual Studio Code 版本进行测试。已知其他变体（例如 code-oss）会阻碍资源的安装，从而导致运行时错误。

软件测试基于 Windows 10 和 Ubuntu 上使用当前版本的 Chrome、Edge 和 Firefox 完成的。

测试不包括 macOS。如果您觉得 Mac 不应该是二等公民，那么有三种选择。 （译者：本译者使用macOS翻译此文档……(^-^)）

* 加入团队并在您的 Mac 上进行测试
* 赞助一台Mac以供测试
* 说服 Apple 在虚拟机上支持 macOS 以进行测试，而不是主动阻碍。（译者：生草）

测试不包括 Windows XP、7 或 8，但我们将会认真对待这些平台提供的错误报告。

## 提交bug、错误

在库中提交issue

对于与表现的 Markdown 相关的问题，请附上演示该问题的测试文档。包括支持图像和样式表。对于需要目录结构的示例，请使用 zip 文件。 

错误结果的截图也是一个不错的主意

## 插件设置

本插件的设置支持高自由度自定义。通过 Code > Preferences > Settings > Extensions > Printing 进行修改设置。

**设置详情可通过 [手册](https://github.com/PeterWone/vsc-print/blob/master/manual.md)查询**

## 浏览器的选择

不同的浏览器带来不同体验  

### 推荐

任何基于Chromium的衍生浏览器应该都没问题，已知下列浏览器运行良好：
* Brave
* Chromium
* Chrome
* Edge

### 不推荐

* Firefox 浏览器在打印完成后不会自动关闭浏览器
* 老版本 Edge 不再支持
* 不再支持 IE （译者：IE早点毁灭吧）

## 已知问题

### 程序安装问题

VS Code 的非官方版本（例如 code-oss）可能无法安装依赖，从而导致无法找到 CSS 文件的错误。有关详细信息和解决方式说明，请参阅 https://github.com/PeterWone/vsc-print/issues/116 

### Markdown 扩展和远程

要在远程主机上使用 Print，您必须在**远程主机**上安装它。

为了有利于远程主机在使用 Markdown 扩展打印， 该Markdown拓展必须使用`extensionKind` 来构建 `workspace`。 _并且_ 其必须被安装在远程主机上。而大多数拓展不是为了`workspace`而构建的，但是可以通过修改它们的`package.json`来实现. 不幸的是，每当更新扩展时，这个手动修改添加的补丁很可能会丢失，因此您应该向您使用的扩展的作者提出这个问题。

### 路径中的空格

在 Windows 上，您无法在备用浏览器路径上提供命令行选项，因为我们会自动在您的路径周围加上引号，以防文件或文件夹名称中有空格。

在其他平台上不会自动引用，您必须手动转义文件和文件夹名称中的空格。

可以通过在与浏览器可执行文件相同的目录中创建批处理文件来解决自动引用的问题，并使用它来指定您需要的选项。对于浏览器路径，请提供批处理文件的路径。请不要忘记传递 URL 参数。

### Chrome与插件
Chrome 可能会在打印作业之间保留您的打印机、纸张尺寸和边距选择。即使打印成功，某些 Chrome 命令行也会报告错误信息。 

某些 Chrome 插件会干扰打印作业样式。您可以尝试通过禁用该插件来解决问题。

更好的解决方法是使用另一个浏览器用于打印。也可以通过在Edge上修改配置文件，以在不使用两个浏览器的情况下获得相似的打印结果。

### 间接的互联网依赖

Math+Markdown 扩展（安装 KaTeX 插件）需要 Internet 连接来获取样式表和字体。您还必须配置样式表引用。详情请见手册。

## 更新说明

### 0.9.16

- Add Markdown style setting for blockquotes (#123)
- Enforce Markdown style settings over all else

### 0.9.15

- Fixed issue 98 - print Markdown rendered from unsaved files
- Added instructions on modifying Markdown plugin extensions to allow them to work with remote hosts.

### 0.9.14

- Emergency bugfix for printing unsaved files
- Emergency bugfix for printing files with Azure Uris that are not backed by a complete filesystem

### 0.9.13

- Emergency bugfix for printing a selection

### 0.9.12

- Emergency bugfix for resolution of local resources referenced by Markdown

### 0.9.11

- Total rewrite of file management in support of remote file systems
- Glob brace expressions can be nested
- Exclusion is forced for
  - `**/*.{exe,dll,pdb,pdf,hex,bin,png,jpg,jpeg,gif,bmp}` 
  - `{bin,obj}`
- Change to licence terms refusing licence to persons who give a bad review without first reading the manual or seeking assistance by raising an issue on the GitHub repository

### 有关完整的更新记录，请参阅更新日志
