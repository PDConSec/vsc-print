# Visual Studio Code Impresión

[Version Española](https://github.com/UPL123/vsc-print) por UPL123

[ENGLISH](README.md) | [FRANCAISE](README.fra.md) | [DEUTSCH](README.deu.md) | [ESPAGNOLE](README.esp.md) | [中文CHINESE](README.zho.md) | [Add a language](how-to-add-a-language.md)

## Impresión

### Configuración para imprimir en un host remoto

Debe instalar la extensión de impresión en el sistema de destino. Si el host de destino es su estación de trabajo, no se requiere ninguna otra acción, pero cuando el host de destino es un host remoto, también debe instalar la extensión de impresión en el host remoto.

1. Conéctese al host remoto
2. Haga clic en el ícono de extensiones en el borde izquierdo de la interfaz de usuario de VS Code.
3. Busque la extensión Imprimir.
4. Debe tener una pequeña insignia que ofrezca instalar en el host remoto. Haga clic en la insignia y VS Code lo tomará desde allí.

Debe volver a hacer esto para cada host remoto diferente al que se conecte (diferentes contenedores Docker, por ejemplo).

Las extensiones de Markdown también deben instalarse en el host de destino si desea usarlas.

### Imprimir el documento activo

Para imprimir el documento activo, simplemente haga clic en el icono de la impresora a la derecha de las pestañas del documento. El control del tamaño del papel, los márgenes y la orientación de la página se encuentra en el cuadro de diálogo de impresión.

### Imprimir una selección en el documento activo

Seleccione al menos una línea en el documento activo. A continuación, haga clic en el icono de la impresora a la derecha de las pestañas del documento o haga clic con el botón derecho en la selección y elija "Imprimir" en el menú contextual. Cuando aparece el menú contextual, `Imprimir` aparece en (o cerca) de la parte superior, inferior o en ninguna parte dependiendo de la configuración `Imprimir: Posición del elemento del menú contextual del editor`.

Los números de línea en su impresión están alineados con los números de línea en el editor, ya sea que estén visibles o no. Entonces, si está discutiendo una línea de código numerada 1145 en una revisión de código y abre el archivo para modificarlo, al escribir 'Ctrl+G' y luego 1145 '[Enter]' colocará su cursor directamente en la línea de código en cuestión.

### Imprimir un archivo sin abrirlo

Para imprimir un archivo que no sea el documento activo, búsquelo en el panel EXPLORADOR y haga clic derecho sobre él. En el menú contextual del archivo, `Imprimir` siempre aparece en o cerca de la parte superior del menú. Esto imprime todo el archivo.

## Imprimir todos los archivos en una carpeta

Si presiona `F1` y escribe `imprimir carpeta` encontrará que puede imprimir todos los archivos en la carpeta que contiene el documento activo. Se crea un solo trabajo de impresión con todos los archivos separados por encabezados que muestran sus nombres.

## Configuración

Esta extensión tiene la siguiente configuración, que se puede modificar yendo a Código > Preferencias > Configuración > Extensiones > Impresión:

* `print.alternateBrowser`: activar/desactivar un navegador alternativo
* `print.announcePortAcquisition`: hace que el servidor web incorporado le diga qué puerto usa
* `print.browserPath`: la ruta a un navegador web
* `print.colourScheme`: la hoja de estilo utilizada para colorear la sintaxis
* `print.editorContextMenuItemPosition`: la posición de `Imprimir` en el menú contextual del editor
* `print.editorTitleMenuButton`: muestra el botón de impresión en el menú del título del editor
* `print.fontSize`: el tamaño de fuente (opciones de 6 a 13 pt)
* `print.formatMarkdown`: renderiza Markdown como HTML con estilo al imprimir
* `print.lineNumbers`: activado, desactivado o heredado (haga lo mismo que el editor)
* `print.lineSpacing` : simple, línea y media o doble espacio
* `print.printAndClose` : después de imprimir, cierre el navegador
* `print.webserverUptimeSeconds`: número de segundos para mantener el servidor web funcionando
* `print.folder.include`: patrón para los archivos a incluir. Vacío coincide con todo.
* `print.folder.exclude`: patrones a excluir
* `print.folder.maxLines`: los archivos que contengan más líneas que este umbral serán ignorados

### Tipo de cara y tamaño

El tipo de letra está determinado por la configuración del editor de VS Code. Si ve el código Fira en la pantalla, eso es lo que se imprimirá.

El _tamaño_ del texto impreso es una configuración de impresión porque el tamaño que funciona mejor en la pantalla puede no ser el tamaño que funciona mejor en el papel.

#### Una nota sobre la nomenclatura

Una fuente define *todos* los siguientes:
* **tipo de letra**, por ejemplo, Consolas o Fira Code
* **tratamiento** p. ej. cursiva
* **peso** p. ej. 700 (negrita)
* **tamaño** p. ej. 12pt

"Fira Code" es un tipo de letra, no una fuente. "Fira Code 12pt Bold" es una fuente. Cursiva es un _tratamiento_ y Negrita es un _peso_. Sí, sé que descargas archivos de fuentes. Antes de TrueType, había un archivo separado por combinación de tamaño y tratamiento y realmente era un archivo de fuente. "Fuente escalable" es una contradicción en los términos.

#### Si desea un tamaño de fuente diferente a los tamaños enumerados en el selector
1. Cambie el tamaño con el selector para crear cómodamente una entrada en la configuración.
2. Edite la configuración como JSON y escriba algún otro tamaño, teniendo cuidado de no estropear las unidades.

## Rebaja

Probablemente desee renderizar y diseñar los trabajos de impresión de Markdown, y este es el comportamiento predeterminado. Si, por sus propias razones inefables, desea imprimir el texto sin procesar, puede desmarcar la configuración `Imprimir: Renderizar Markdown`.

## Navegador alternativo

Puede imprimir con un navegador que no sea su navegador predeterminado.

¿Por qué querrías hacer eso?

* Chromium, Edge Dev y Chrome son los únicos navegadores que se cierran correctamente después de imprimir. Esto los convierte en las mejores opciones para imprimir, pero es posible que tenga una preferencia diferente para el uso diario de la web.
* Esto puede ser útil para solucionar problemas. Tal vez esté creando su propia hoja de estilo y desee poder evitar que el navegador se cierre después de la impresión para que pueda inspeccionar en pantalla.
* Alguna otra razón tuya que no puedo imaginar.

Para configurar un navegador alternativo debe hacer dos cosas:

1. Proporcione la ruta al ejecutable del navegador en la configuración `Imprimir: ruta del navegador`. En Windows podría ser algo como `C:\Program Files (x86)\Google\Chrome\Application\Chrome.exe`
1. Habilite/desactive el navegador alternativo usando la configuración `Imprimir: Navegador alternativo`

## Elija un esquema de color

Las hojas de estilo personalizadas ya no son compatibles. Las hojas de estilo disponibles están agrupadas y se pueden elegir por nombre de una lista. Las opciones están limitadas a hojas de estilo ligeras porque el papel es blanco.

## Servidor web

El servidor web permite conexiones solo desde localhost. Se rechazan las conexiones de otros hosts.

## Extensión Katex Markdown
Esto depende del CSS y las fuentes de la web. Para que la impresión funcione, debe agregar la hoja de estilo requerida a su configuración. Si encuentra que una o dos cosas funcionan en la vista previa pero no están impresas, determine la versión actual del sitio web de KaTeX y actualice la URL.

```json
"markdown.styles": [
  "https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"
]
```

Aquí hay algunos ejemplos para ayudarlo a verificar su configuración.

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

# Extensiones Markdown y espacios de trabajo remotos

Para trabajar con espacios de trabajo remotos, se debe ejecutar una extensión de Markdown en el host remoto porque ahí es donde se ejecuta la canalización de representación de Markdown. La mayoría de las extensiones de Markdown son capaces de funcionar así, pero no están configuradas para ello.

El problema es que la mayoría de ellos no están configurados de esta manera, aunque todo lo que se necesita es una sola entrada en su archivo `package.json`.

Afortunadamente, puedes parchearlos tú mismo.

1. Busque las extensiones donde están instaladas en su estación de trabajo en `~/.vscode/extensions` (en Windows, sustituya `%userprofile%` por `~`)
2. Edite los archivos `package.json` para las extensiones de Markdown que desea usar en hosts remotos. Agrega el atributo `extensionKind`.
3. Cuando haya editado todas las extensiones de Markdown, reinicie VS Code.

Es un atributo de nivel raíz, por lo que puede colocarlo desde el principio. Si este atributo ya está presente, VS Code pronto se lo dirá. Para funcionar correctamente con un host remoto, debe especificar "espacio de trabajo". No incluya tanto `workspace` como `ui`. Si lo hace, VS Code preferirá la estación de trabajo local y funcionará localmente pero fallará para los espacios de trabajo remotos.
Necesita que esté determinado por el espacio de trabajo.

¿Qué sucede si tiene un espacio de trabajo remoto, pero un editor contiene un archivo local? Cuando ese archivo local sea el código fuente, la impresión funcionará. Para Markdown que no tiene referencias de recursos, la impresión funcionará. Pero las referencias de Markdown a las imágenes se resolverán en el sistema de archivos remoto y no se encontrarán las imágenes.

```json
{
  "extensionKind": [
    "workspace"
  ],
  "name": "vscode-print",
  "displayName": "Print",
```
