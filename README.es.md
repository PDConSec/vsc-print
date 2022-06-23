# <img width="64px" src="vscode-print-128.png"></img> Print

[Página del mercado](https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print)

[Version Española](https://github.com/UPL123/vsc-print) por UPL123

[ENGLISH](README.md) | [FRENCH](README.fra.md) | [Add a language](how-to-add-a-language.md)

La mayoría de las fallas en el primer uso se deben a un reenvasado defectuoso por parte de un tercero. Si esto le sucede a usted, obtenga el [paquete producido y probado por nosotros](https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print).

## Markdown y código fuente, diseñados para imprimir

* Imprimir código fuente
* Imprimir Markdown completamente renderizado
* Admite espacios de trabajo remotos

El código fuente obtiene números de línea y colores de sintaxis. Markdown se procesa con la canalización de procesamiento de vista previa de VS Code &mdash; muchas extensiones de Markdown funcionan con la impresión.

## Impresión independiente de la plataforma

Los trabajos de impresión se representan como HTML con estilo y se sirven desde un servidor web incorporado. Cuando imprime, se inicia su navegador web local para cargar el trabajo de impresión y brindarle opciones de impresión como la orientación de la página y el tamaño del margen. Entonces, si tiene un navegador local que puede imprimir y VS Code puede iniciarlo, está en el negocio. Las plataformas de usuario conocidas incluyen Windows, Linux y OSX.

### Solución de problemas en el primer lanzamiento

La impresión funcionó para cincuenta mil personas desde el primer momento, pero a veces la configuración y los permisos locales pueden estropear la diversión. Aquí hay algunos problemas que la gente ha encontrado y qué hacer. Si algo más está mal o si tiene una idea de mejora, lo invitamos a registrar un problema en el repositorio de GitHub.

* Parece que no pasa nada &mdash; reinicie el código VS.
* El navegador Firefox es problemático. Instale Chromium (o Chrome, Edge, Brave...) y conviértalo en el navegador predeterminado o configure la extensión Imprimir para usar un navegador específico (RTFM).
* El navegador se inicia pero no se carga la página &mdash; verifique los permisos de red.
* El navegador muestra un mensaje de error sobre no encontrar un archivo CSS &mdash; instaló desde un VSIX que no fue preparado por nosotros. Obtenga el [paquete oficial](https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print) y vuelva a intentarlo.

## Experiencia de usuario clásica

![Complemento de la barra de herramientas con el icono de impresión](https://user-images.githubusercontent.com/5498936/53408273-d853d480-3a09-11e9-8936-d37189dce8c5.PNG)

El icono de impresión de la barra de herramientas imprime el documento en el editor activo.

Si tiene una selección de texto que cruza al menos un salto de línea, puede hacer clic con el botón derecho y elegir "Imprimir" en el menú contextual para enviar solo la selección a la impresora. En ausencia de una selección de varias líneas, se imprime el documento completo. Puede controlar la posición de `Imprimir` en este menú o eliminarlo por completo.

![context-menu-editor](https://user-images.githubusercontent.com/5498936/53408378-05a08280-3a0a-11e9-8e88-0088089e0d07.png)

O puede hacer clic con el botón derecho en un archivo en el panel del explorador de archivos y elegir Imprimir en el menú contextual.

![context-menu-file-explorer](https://user-images.githubusercontent.com/5498936/53408376-05a08280-3a0a-11e9-9912-31e869db64d5.png)

## Características

Impresión en Mac, Linux y Windows

* Operación completamente local, sin dependencia de los servicios en la nube (las extensiones de Markdown de terceros pueden introducir dependencias remotas)
* Coloreado de sintaxis en una amplia gama de esquemas de color familiares
* Numeración de línea opcional
* Interlineado ajustable (1, 1,5, 2)
* Imprima una selección de código con números de línea que coincidan con el editor
* Especifique un navegador que no sea el predeterminado
* Los documentos Markdown se procesan cuando los imprime (o no, hay una configuración)
* Funciona con extensiones de host remoto de Microsoft para contenedores SSH, WSL y Docker

## Requirements

* Necesitará un navegador web que tenga acceso a una impresora. Firefox _no_ es una opción ideal, pero si lo prefiere como su navegador predeterminado, le complacerá saber que puede configurar la impresión para usar un navegador no predeterminado &mdash; puedes tenerlo de las dos maneras.
* El usuario con el que se ejecuta VS Code debe poder establecer un socket de escucha.

## Control de calidad

Este software se prueba solo con la versión de Visual Studio Code publicada por Microsoft. Se sabe que otras variantes, como code-oss, fallan en la instalación de recursos, lo que genera errores de tiempo de ejecución.

Las pruebas se realizan en Windows 10 y Ubuntu con versiones actuales de Chrome, Edge y Firefox.

Las pruebas no incluyen OSX. Si cree que las Mac no deberían ser ciudadanos de segunda clase, existen tres opciones.

* Únete al equipo y prueba en tu Mac
* Dona una Mac para probar
* Convencer a Apple para que admita OSX en una máquina virtual con fines de prueba en lugar de ser una obstrucción activa.

Las pruebas no incluyen Windows XP, 7 u 8, pero se tomarán en serio los informes de errores detallados relacionados con estas plataformas.

## Reportar errores

Plantear un problema en el repositorio.

Para problemas relacionados con Markdown renderizado, adjunte un documento de prueba que demuestre el problema. Incluye imágenes de apoyo y hojas de estilo. Utilice un archivo zip para muestras que requieran una estructura de directorio.

Las capturas de pantalla de los resultados fallidos siempre son una buena idea.

## Configuración

La extensión Imprimir es altamente configurable. La configuración se puede modificar yendo a Código > Preferencias > Configuración > Extensiones > Impresión.

**Puede encontrar un desglose detallado de estas configuraciones en [el manual](https://github.com/PeterWone/vsc-print/blob/master/manual.es.md).**

## Selección de navegador

El navegador utilizado afectará su experiencia.

### Recomendado para imprimir

Cualquier navegador derivado de Chromium debería estar bien. Se sabe que los siguientes funcionan bien.

* Brave
* Chromium
* Chrome
* Edge

### No recomendado para imprimir

* Firefox no cierra el navegador después de completar la impresión.
* Edge Classic ya no es compatible.
* Internet Explorer no es compatible.

## Problemas conocidos

### Problemas del instalador

Las variantes no estándar de VS Code, como code-oss, pueden fallar al instalar las dependencias, lo que genera errores sobre la imposibilidad de encontrar archivos CSS. Consulte https://github.com/PeterWone/vsc-print/issues/116 para obtener detalles e instrucciones correctivas.

### Extensiones de Markdown y comunicación remota

Para usar Print con un host remoto, debe instalarlo **en el host remoto**.

Para obtener el beneficio de una extensión Markdown al imprimir un documento desde un host remoto, la extensión Markdown debe construirse con un `extensionKind` de `workspace` _y_ debe instalarse en el host remoto. La mayoría de estas extensiones no están diseñadas para `workspace`, pero pueden corregirse de manera trivial modificando su `package.json`. Desafortunadamente, es probable que este parche manual se pierda cada vez que se actualice la extensión, por lo que debe plantear un problema con el autor de las extensiones que parchee.

### Espacios en caminos

En Windows, no puede proporcionar opciones de línea de comandos en la ruta alternativa del navegador porque colocamos automáticamente comillas alrededor de su ruta en caso de espacios en los nombres de archivos o carpetas.

En otras plataformas, las comillas automáticas no se realizan y debe escapar manualmente los espacios en los nombres de archivos y carpetas.

Evite las cotizaciones automáticas creando un archivo por lotes en el mismo directorio que el ejecutable del navegador y utilícelo para especificar las opciones que necesita. Para la ruta del navegador, proporcione la ruta al archivo por lotes. No olvide pasar el parámetro URL.

### Chrome y complementos
Chrome puede conservar su impresora, el tamaño del papel y las selecciones de márgenes entre los trabajos de impresión. Algunas opciones de la línea de comandos de Chrome hacen que se informen errores, aunque la impresión se realice correctamente.

Algunos complementos de Chrome interfieren con el estilo del trabajo de impresión. Si bien es posible suprimir complementos con `--disable-plugins`, esto no funciona cuando ya hay una instancia de Chrome en ejecución. El interruptor `--incognito` suprime los complementos cuando hay una instancia en ejecución, pero tiene sus propios problemas.

Para obtener mejores resultados, queme algo de espacio en disco e instale otro navegador como Chromium, y utilícelo para imprimir. Es posible que pueda lograr un resultado similar sin necesidad de dos navegadores mediante el uso de perfiles en Edge.

### Dependencias indirectas de Internet

La extensión Math+Markdown (instala el complemento KaTeX) requiere una conexión a Internet para hojas de estilo y fuentes. También debe configurar una referencia de hoja de estilo. Los detalles están en el manual.

## Notas de lanzamiento

### 0.9.16

- Agregue la configuración de estilo Markdown para blockquotes (# 123)
- Hacer cumplir la configuración de estilo de Markdown sobre todo lo demás

### 0.9.15

- Problema solucionado 98 - Imprime Markdown renderizado desde archivos no guardados
- Se agregaron instrucciones sobre la modificación de las extensiones del complemento Markdown para permitirles trabajar con hosts remotos.

### 0.9.14

- Corrección de errores de emergencia para imprimir archivos no guardados
- Corrección de errores de emergencia para imprimir archivos con Azure Uris que no están respaldados por un sistema de archivos completo

### 0.9.13

- Corrección de errores de emergencia para imprimir una selección

### 0.9.12

- Corrección de errores de emergencia para la resolución de recursos locales a los que se hace referencia en Markdown

### 0.9.11

- Reescritura total de la gestión de archivos en apoyo de sistemas de archivos remotos
- Las expresiones de llaves globales se pueden anidar
- La exclusión es forzosa para
  - `**/*.{exe,dll,pdb,pdf,hexadecimal,bin,png,jpg,jpeg,gif,bmp}`
  - `{bin, objeto}`
- Cambio en los términos de la licencia negando la licencia a las personas que dan una mala crítica sin leer primero el manual o buscar ayuda al plantear un problema en el repositorio de GitHub

### Consulte el registro de cambios para obtener un historial completo.