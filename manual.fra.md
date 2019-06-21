# Visual Studio Code Printing

[Version français](https://github.com/PeterWone/vsc-print) par Peter Wone

[ENGLISH](manual.md) | [FRENCH](manual.fra.md) | [РУССКИЕ](manual.rus.md) | [Add a language](how-to-add-a-language.md)

## Pour imprimer...

### Le document actif

Pour imprimer le document actif, cliquez sur l'icône de l'imprimante à droite des onglets du document.

### Une sélection dans le document actif

Sélectionnez au moins une ligne dans le document actif. Ensuite, cliquez sur l'icône de l'imprimante à droite des onglets du document ou cliquez à droite sur la sélection et choisissez `Print` dans le menu contextuel. Lorsque le menu contextuel apparaît, `Print` apparaît en haut (ou près) en haut, en bas ou nulle part en fonction du paramètre `imprimer.positionAuMenuContextuelDeLEditeur`.

Les numéros de ligne de votre impression sont alignés avec les numéros de ligne de l'éditeur, qu'ils soient visibles ou non. Donc, si vous discutez d'une ligne de code numérotée 1145 dans un réexamen de code et que vous ouvrez le fichier pour l'amender, en tapant `Ctrl+G` puis 1145 `Enter` mettra votre curseur directement sur la ligne de code en question.

### Un fichier (sans l'ouvrir)

Pour imprimer un fichier autre que le document actif, trouvez-le dans le volet EXPLORER et cliquez à droite dessus. Au menu contextuel du fichier `Imprimer` apparaît toujours en haut du menu ou près de celui-ci. Ceci imprime le fichier entier.

## Paramètres

Cette extension comporte les paramètres suivants, qui peuvent être modifiés en allant dans le code Préférences > Paramètres > Extensions > Impression:

* `imprimer.navigateurAlternatif` : activer/désactiver un navigateur alternatif
* `imprimer.annoncerLAcquisitionDuPort` : faites en sorte que le serveur web intégré vous dise quel port il utilise
* `imprimer.cheminDeStockageDuNavigateur` : le chemin (path) vers un navigateur web
* `imprimer.couleurs` : la feuille de style utilisée pour colorier la syntaxe
* `imprimer.portDynamiqueMax` : la limite supérieure de la plage dans laquelle le serveur web intégré choisira les ports
* `imprimer.portDynamiqueMin` : la limite inférieure de la plage dans laquelle le serveur web intégré choisira les ports
* `imprimer.positionAuMenuDuContextuelDeLEditeur` : la position de la commande `Imprimer` au menu contextuel de l'éditeur
* `imprimer.imprimerPuisFermer` : après l'impression, fermez le navigateur.
* `imprimer.tailleDeLettrage` : la taille de lettrage (options de 9 à 13 pt)
* `imprimer.rendreLeMarkdown` : rendre le markdown comme HTML stylé lors de l'impression
* `imprimer.numérotage` : on, off ou inherit (faire la même chose que l'éditeur)
* `imprimer.espacementDesLignes` : simple, ligne et demie ou double espacement

### Choix de caractère

Bien que la taille de lettrage soit contrôlée par les paramètres, la _police de caractères_ est déterminée par les paramètres de votre éditeur. Si vous voyez Fira Code à l'écran, c'est ce qui sera imprimé.


## Markdown

Lorsque vous Markdown vous voulez probablement qu'il soit rendu et stylisé, et c'est le comportement par défaut. Si, pour des raisons ineffables, vous souhaitez imprimer le texte brut, vous pouvez dévérifier le paramètre `imprimer.rendreLeMarkdown`.

## Modification de la gamme de ports dynamique

Le navigateur reçoit du contenu à partir d'un serveur Web intégré. Ce serveur web sonde pour un port inutilisé. Il s'agit du mécanisme par lequel il est possible d'exécuter plusieurs instances de code VS (et donc plusieurs serveurs Web intégrés) sans conflit de port. Les logiciels tiers peuvent être moins accommodants, et il peut être souhaitable de déplacer la plage dans laquelle VS Code choisit les ports. Vous pouvez le faire en spécifiant

* `imprimer.portDynamiqueMax` : la limite supérieure de la plage dans laquelle le serveur web intégré choisira les ports
* `imprimer.portDynamiqueMin` : la limite inférieure de la plage dans laquelle le serveur web intégré choisira les ports

Par défaut, les versions plus tôt que 0.6.12 ont commencé à sonder pour un port libre à partir de 8000 parce que c'était le comportement par défaut de la bibliothèque en usage. Sous Windows, la plage de port dynamique officielle est de 49152 à 65535 et l'analyse portuaire est désormais limitée à cette plage. Il peut être nécessaire pour les utilisateurs sur d'autres plates-formes de modifier la portée du port.

## Navigateur alternatif

Vous pouvez imprimer avec un navigateur autre que votre navigateur par défaut.

Pourquoi souhaiter le faire ?

* Chromium, Edge Dev et Chrome sont les seuls navigateurs qui se ferment correctement après l'impression. Cela en fait les meilleurs choix pour l'impression, mais vous pouvez avoir une préférence différente pour l'utilisation quotidienne du Web.
* Cela peut être pratique pour le dépannage. Peut-être que vous êtes l'élaboration de votre propre feuille de style et que vous voulez être en mesure d'arrêter le navigateur de fermer après l'impression afin que vous puissiez inspecter à l'écran.
* Une autre raison que je ne peux pas imaginer.

Pour configurer un autre navigateur, vous devez faire deux choses :

1. Fournir le chemin au navigateur exécutable dans le paramètre `Imprimer: Chemin de stockage du navigateur`. Sur Windows, il pourrait être quelque chose comme `C:\Program Files (x86)\Google\Chrome\Application\Chrome.exe`
1. Activer/désactiver le navigateur alternatif à l'aide du paramètre 'Imprimer: Navigateur alternatif'

## Choisissez un schéma de couleurs

Les couleurs utilisées pour la mise en surbrillance syntaxe peuvent être stylisées en fournissant une feuille de style CSS. Appuyez sur `F1` et tapez `Parcourir pour la feuille de style` pour trouver la commande pour définir ceci. Invoquant il ouvrira un dialogue de navigation de fichier qui par défaut dans le dossier contenant le cache de feuilles de style de VS Code Printing. Si vous naviguez ailleurs et choisissez un fichier CSS, il sera importé dans le dossier cache (potentiellement en train de passer à l'appel d'un fichier du même nom).

Le paramètre indique la copie mise en cache, donc si vous effectuez des modifications, vous devez répéter le processus d'importation.

## Extension de markdown de Katex
Cela dépend de CSS et polices des caractères du web. Pour que l'impression fonctionne, vous devez ajouter la feuille de style requise à vos paramètres.

		"markdown.styles": [
			"https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css"
		]

Voici quelques échantillons pour vous aider à vérifier votre configuration.

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
