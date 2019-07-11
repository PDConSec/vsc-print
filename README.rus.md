# Visual Studio Code Печати

[English version](https://github.com/PeterWone/vsc-print) by Peter Wone

[ENGLISH](README.md) | [FRENCH](README.fra.md) | [РУССКИЕ](README.rus.md) | [Add a language](how-to-add-a-language.md)

![Toolbar snap with print icon](https://user-images.githubusercontent.com/5498936/53408273-d853d480-3a09-11e9-8936-d37189dce8c5.PNG)

Значок печати на панели инструментов печатает документ в активном редакторе.

Если у вас есть выбор текста, который пересекает по крайней мере одну строку-брейк, вы можете нажать право и выбрать `Печать` из контекстного меню, чтобы отправить только выбор принтеру. При отсутствии многолинейного выбора весь документ печатается. Вы можете контролировать положение `Печать` в этом меню, или удалить его вообще.

![context-menu-editor](https://user-images.githubusercontent.com/5498936/53408378-05a08280-3a0a-11e9-8e88-0088089e0d07.png)

Или вы можете нажать правой кнопкой мыши на файл в панели исследователя файла и выбрать печать из контекстного меню.

![context-menu-file-explorer](https://user-images.githubusercontent.com/5498936/53408376-05a08280-3a0a-11e9-9912-31e869db64d5.png)

## Функции

Печать на Mac, Linux и Windows

Полностью локальный в эксплуатации, отсутствие зависимости от облачных служб
- Окраска Syntax в широком диапазоне знакомых цветовых схем, которые можно импортировать или изменять
- Факультативная нумерование строк
Регулируемый интервал линии (1; 1,5; 2)
- Печать подборки кода с номерами строк, соответствующих редактору
Укажите браузер, не встышую по умолчанию
Документы разметки отображаются при их печати (или нет, есть параметр)

Это расширение тестируется с Windows 10 с текущими сборками Chrome, Edge и Firefox.
Я не могу проверить на Mac, потому что я не владею одним. Кроме того, у меня нет систем под управлением Windows XP, 7 или 8.
Если вы используете какую-то другую комбинацию, то сообщате об ошибках с помощью тестовых документов и снимков неудачных результатов.


## Требования

Вам понадобится веб-браузер и доступ к принтеру.

## Настройки расширения

VS Code Printing очень настраиваема. Настройки могут быть изменены, перейдя в Код - Предпочтения - Настройки - Расширения и печать.

**Подробную разбивку этих настроек можно найти в [руководстве](https://github.com/PeterWone/vsc-print/blob/master/manual.rus.md).**

## Известные проблемы

Заставить печатные вкладки уважать настройки размера вкладки редактора зависит от экспериментального свойства CSS `tab-size`. Это не работает на Эдж. Когда Edge начнет использовать двигатель Chromium проблема исчезнет.
Chrome remembers too much about printers, paper sizes and margins especially if you abort.

KaTeX требует подключения к Интернету. Необходимо также настроить ссылку на таблицу стилей. Подробности в руководстве.

## Заметки о выпуске

### 0.7.12

- Проблема 40 - предотвратить двойное расширение файла, производящее необработанное исключение в генераторе страницы, задерживающее встроенный веб-сервер, в результате чего пустое белое окно браузера для загрузки страницы, которая не завершена.
- Проблема 41 - обрабатывать неожиданные исключения в генераторе страницы, обеспечивая стек ошибок в качестве содержимого страницы, тем самым значительно улучшая диагностическую информацию в вопросах.

### 0.7.11

- Проблема 39 - коррекция к неуместно scoped регулярному выражению причиняя двоеточие быть избеубежено в всем документе когда они должны быть избеубежены только в URL.

### 0.7.9

- Проблема 36 - исправлена проблема с внутренним репилингом конвейера, переписающим URL-адреса для использования внутреннего протокола vscode. Это вызвало ссылки на изображения для работы в предварительном просмотре, но не в браузере.

### 0.7.8

- Проблема 35 - путь кэша кэша таблицы стилей неправильно построен на файловых системах, не относяющихСя к Windows. Теперь это исправлено.

### 0.7.7

- Проблема 33 - настройка вкладки-размера редактора была неправильно извлечена и поэтому не соблюдается. Теперь это исправлено.
- Проблема 34 - печать не удается для прямого вызова (нажмите `F1`, то тип печати: Печать, наконец, нажмите `Enter`). Теперь это исправлено.

### 0.7.6

- Локализованна на французский язык.
- Русская "локализация" - это заглушка (все еще на английском языке) в ожидании переводов.
- Доступность меню и значка теперь определяется из editorLangId, а не с ресурсомLangId. Это должно позволить печатать несохраненные документы и непризнанные типы файлов в выпуске 31 и 32.

### 0.7.1

Now using VS Code's markdown rendering pipeline.
- faster load
- smaller memory footprint
- markdown extensions like [Markdown+Math](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath) take effect when printing

### 0.7.0

- Bump minor version as 0.6.13 introduced new settings changing the UX
- Fix support for extended character sets and mixed languages in printed source code (#29) with thanks to Ekgart Vikentiy for reporting this.

### 0.6.13

Stub release because there's no other way to patch the readme.

### 0.6.12

- Settings to allow the user to move the range in which the embedded webserver chooses ports
- Moved default port range into the correct range for dynamic ports (was library default)
- Separate manual thanks to Nat Kuhn

### 0.6.9

- UTF-8 for extended charsets.
- Support images on local paths.

[ac WEB DESIGN](http://www.ac-webdesign.ch/) reported both these issues and provided test content.

### 0.6.8

- Control whether the embedded web server announces which port it acquires (off by default).
- Render Markdown with the same engine VS Code uses for preview.

### 0.6.7

Report acquired port to user with toast.

### 0.6.5

- Context menu position is now a setting.
- New store graphics.

### 0.6.2

Fixes command categories so they appear as

- Print: Browse for stylesheet
- Print: Print

The commands are present and functional in 0.6.1 but are not correctly categorised.

Colour scheme stylesheets are no longer selected from a combo-box. Instead there is a new command `Print: Browse for stylesheet` that spawns a file-browse dialog and updates the setting. If you choose a file outside the stylesheet cache it is copied into the cache so you don't become dependent on network-local resources.

Earlier versions occasionally had problems with port collisions causing printing to fail. A manual retry or three always fixed it but this was ugly. Correcting the problem was the primary focus of 0.5.3, and I am pleased to finally remove it from known issues.

Also addressed is [issue #17](https://github.com/PeterWone/vsc-print/issues/17) which moves responsibility for language detection from highlightjs (the library used for syntax colouring) to VS Code, falling back to highlightjs when an incompatible language code is produced.

Microsoft Edge always prompts for permission to close the browser after printing, which can be annoying.
Firefox doesn't prompt, it just plain doesn't close the browser, which is beyond annoying. As a result, Chrome is the recommended browser for printing.

### 0.6.2

Apply categories to commands.

### 0.6.1

Documentation tweak.

### 0.6.0

- Colour scheme stylesheet setting is no longer presented as a combo-box. Instead, there is a command that presents a file-browse dialog and updates the setting.
- Language detection falls back to highlightjs when VS Code produces an incompatible language identifier.

### 0.5.3

- Tab size respects editor setting.
- Responsibility for language detection moved from highlightjs to VS Code.

