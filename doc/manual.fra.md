# Extension « Imprimer »

Version français par Peter Wone

[ENGLISH](manual.fra.md) | [FRANCAISE](manual.fra.md) | [DEUTSCH](manual.deu.md) | [ESPAGNOLE](manual.esp.md) | [中文CHINESE](manual.zho.md) | [Add a language](how-to-add-a-language.md)

# Table des matières

1. [Utilisation générale](#Utilisation-générale)
2. [Personnalisation de votre configuration](#Personnalisation-de-votre-configuration)
3. [Markdown](#markdown)
4. [Markdown extensions and remote workspaces](#markdown-extensions-and-remote-workspaces)
5. [Troubleshooting](#troubleshooting)

# Utilisation générale

Il y a plusieurs façons d’imprimer.

* Vous pouvez imprimer le document actif, par icône ou menu contextuel.
* Vous pouvez imprimer une sélection à partir du document actif, par icône ou menu contextuel.
* Vous pouvez imprimer un fichier directement à partir du panneau de l’explorateur de fichiers, sans ouvrir le fichier au préalable, par menu contextuel.
* Vous pouvez imprimer tous les fichiers d’un répertoire soumis à des listes d’exclusion.

Les documents Markdown peuvent être rendus et stylisés. Ceci est détaillé dans la section Markdown.

## Imprimer le document actif

Pour imprimer le document actif, cliquez simplement sur l’icône de l’imprimante à droite des onglets du document. Assurez-vous que vous n’avez pas plusieurs lignes de texte sélectionnées. Sinon, vous imprimerez la sélection, pas le document entier. **Le contrôle du format de papier, des marges et de l’orientation de la page se trouve dans la boîte de dialogue d’impression.**

## Imprimer une sélection dans le document actif

Sélectionnez un bloc de texte de plusieurs lignes dans le document actif. Cliquez ensuite sur l’icône de l’imprimante à droite des onglets du document ou cliquez avec le bouton droit de la souris sur la sélection et choisissez « Imprimer » dans le menu contextuel. Lorsque le menu contextuel apparaît, 'Imprimer' apparaît en haut, en bas ou nulle part en fonction du paramètre `Print: Editor Context Menu Item Position` .

Les numéros de ligne de votre impression sont alignés sur les numéros de ligne de l’éditeur, qu’ils soient visibles ou non. Donc, si vous discutez d’une ligne de code numérotée 1145 dans une révision de code et que vous ouvrez le fichier pour le modifier, en tapant `Ctrl+G` and then 1145 `[Entrée]` placera votre curseur directement sur la ligne de code pertinente.

## Imprimer un fichier sans l’ouvrir

Pour imprimer un fichier autre que le document actif, recherchez-le dans le volet Explorateur et cliquez dessus avec le bouton droit de la souris. Dans le menu contextuel du fichier, `Imprimer` apparaît toujours en haut ou près du haut du menu. Cela imprime l’intégralité du fichier.

## Imprimer tous les fichiers d’un dossier

Pour imprimer tous les fichiers imprimables dans un répertoire, trouvez-le dans le panneau Explorateur à gauche, puis faites un clic droit sur le dossier pour afficher le menu contextuel afin que vous puissiez cliquer sur Imprimer. Une seule tâche d’impression est créée avec tous les fichiers séparés par des en-têtes indiquant leurs noms. Avant les fichiers, un résumé indique le nombre de fichiers. Selon vos paramètres, le résumé peut répertorier les noms de fichiers.

# Personnalisation de votre configuration

La plupart de ces paramètres personnalisent l’expérience utilisateur (icône, emplacement du menu, etc.). Pour trouver ces paramètres, ouvrez le volet des paramètres de VS Code et accédez à Extensions/Impression ou recherchez simplement « impression ».

Voici une liste des noms de paramètres disponibles tels qu’ils apparaissent dans le fichier de configuration.

* `print.alternateBrowser` : activer/désactiver un autre navigateur
* `print.browserPath` : le chemin d’accès à un navigateur Web
* `print.colourScheme` : la feuille de style utilisée pour colorier la syntaxe
* `print.editorContextMenuItemPosition` : la position de `Imprimer` dans le menu contextuel de l’éditeur
* `print.editorTitleMenuButton` : Afficher l’icône d’impression dans le menu du titre de l’éditeur
* `print.fontSize` : la taille de la police (options de 6 à 13 pts)
* `print.formatMarkdown` : rendu Markdown au format HTML stylisé lors de l’impression
* `print.lineNumbers` : activé, désactivé ou hérité (hériter de l’éditeur)
* `print.lineSpacing` : simple, ligne et demie ou double interligne
* `print.printAndClose` : après l’impression, fermez le navigateur
* `print.folder.include`: modèle pour les fichiers à inclure. Vide correspond à tout.
* `print.folder.exclude`: modèles à exclure
* `print.folder.maxFiles`: le nombre maximal de fichiers pour lesquels le contenu est rendu lors de l’impression d’un répertoire
* `print.folder.maxLines`: les fichiers contenant plus de lignes que ce seuil seront ignorés
* `print.logLevel`: contrôle le niveau de détail entrant dans le fichier journal

## Personnalisation de l’interface utilisateur

Vous pouvez contrôler si l’icône d’impression apparaît dans la barre d’outils lorsque vous mettez au point un volet de l’éditeur. Ce paramètre est étiqueté `Editor Title Menu Button`.

Vous pouvez contrôler si l’élément de menu « Imprimer » apparaît en haut, en bas ou nulle part dans les menus contextuels à l’aide du paramètre `Editor Context Menu Item Position`.

Lorsque le réglage `Print and Close` est activé, l’impression de quelque chose ouvre automatiquement la boîte de dialogue Imprimer du navigateur. Après avoir imprimé ou annulé l’impression, le navigateur se ferme. Si vous désactivez cette option, le navigateur ouvrira le navigateur avec le document rendu prêt à être inspecté. Si vous ouvrez ensuite manuellement la boîte de dialogue Imprimer, l’impression ou l’annulation ne fermera pas le navigateur.

## Utilisation d’un navigateur particulier pour imprimer

Par défaut, l’impression utilisera votre navigateur par défaut. Cependant, l’impression fonctionne mieux avec un navigateur dérivé de Chromium, et il peut ne pas être possible ou souhaitable de changer votre navigateur par défaut. 

Pour vous permettre d’imprimer à l’aide d’un navigateur qui n’est pas votre navigateur par défaut, vous pouvez spécifier un chemin d’accès à un autre navigateur, et il existe également une case à cocher pour vous permettre de l’activer et de le désactiver sans perdre le chemin.

Ces paramètres sont intitulés respectivement `Browser Path` et `Alternate Browser`.

Le chemin d’accès à l’autre navigateur est cité automatiquement sous Windows, et sur les plates-formes Unix, les espaces sont échappés. Malheureusement, cela est incompatible avec la fourniture d’options de ligne de commande.

Si vous devez fournir des options de ligne de commande, créez un fichier de commandes (ou un fichier de script bash) qui spécifie les options et reportez-vous au fichier de script bash dans votre autre chemin d’accès au navigateur.

## Impression du code source

À l’aide du paramètre `Colour Scheme` , vous pouvez spécifier la palette de couleurs utilisée pour la coloration syntaxique. Les choix sont limités aux thèmes légers car les imprimantes utilisent du papier blanc. 

Si vous imprimez le document actif et qu’il existe une sélection multiligne, seule la sélection est imprimée. 

### Police de caractères et taille

La police de caractères est déterminée par les paramètres de l’éditeur de code VS. Si vous voyez Fira Code à l’écran, c’est ce qui sera imprimé. 

La _taille_ du texte imprimé est un paramètre d’impression, car la taille qui fonctionne le mieux à l’écran peut ne pas être la taille qui fonctionne le mieux sur papier.

## Impression Markdown

Vous voulez probablement que les travaux d’impression Markdown soient rendus et stylisés, et c’est le comportement par défaut. Si vous souhaitez imprimer Markdown en tant que code source, vous pouvez décocher le paramètre `Print: Render Markdown`.

### Palette de couleurs

Pour l’impression du code source, les feuilles de style sont regroupées et peuvent être choisies par nom dans une liste. Les choix sont limités aux feuilles de style légères car le papier d’imprimante est blanc et les encres d’imprimante et les toners sont conçus pour le papier blanc.

# Markdown

## Styliser votre Markdown

### Appliquer des fichiers CSS à un document Markdown 

* Vous pouvez intégrer une balise de lien de feuille de style directement dans le Markdown. Ceci est spécifique au document.
* Il y a un paramètre appelé `markdown.styles`. Il s’agit d’une liste d’URL. L’aperçu Markdown intégré et l’impression honoreront cette liste. Vous pouvez utiliser des URL absolues, des URL relatives à l’espace de travail ou des URL relatives à un document, comme illustré dans l’exemple suivant.

```json
"markdown.styles": [
	"https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css",
	"path/to/document/relative/custom.css",
	"workspace.resource/path/to/stylesheet.css"
]
```

Les URL relatives à l’espace de travail sont le meilleur moyen de partager des ressources entre des documents. Ils sont dans l’espace de travail afin qu’ils puissent être contrôlés en source avec les documents, et parce que l’URL est relative à l’espace de travail plutôt qu’au document, vous pouvez organiser (et réorganiser) les documents dans des répertoires sans casser les URL. Notez que cela s’applique non seulement aux feuilles de style, mais également aux ressources de fichiers image.

### Associer un style à Markdown

Le mappage de Markdown au HTML généré est évident. Les tables deviennent des éléments `table`, `th` et `td`. Les titres sont `H1` à `H9`. Les paragraphes sont des éléments `P`, les puces et les nombres sont des éléments `ul` et `ol`. 

N’oubliez pas que vous pouvez intégrer du HTML dans Markdown, donc rien ne vous empêche d’utiliser `div` ou `span` pour appliquer une classe CSS à un bloc ou à une exécution de Markdown.

## Serveur Web

Le serveur Web incorporé se lie uniquement à l’adresse de bouclage et accepte uniquement les connexions spécifiées.

## Extensions Katex Markdown

Katex dépend de CSS et de polices du Web. Pour que l’impression fonctionne, vous devez ajouter la feuille de style requise à vos paramètres. Si vous trouvez qu’une ou deux choses fonctionnent dans l’aperçu mais pas encore imprimées, déterminez la version actuelle à partir du site Web KaTeX et mettez à jour l’URL.

```json
"markdown.styles": [
	"https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"
]
```

Si vous souhaitez couper le cordon, importez les ressources Katex dans votre projet comme décrit dans la section précédente et utilisez une référence relative à l’espace de travail. 

Voici quelques exemples pour vous aider à vérifier votre configuration.

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

## Rendu Markdown et espaces de travail distants

Pour travailler avec des espaces de travail distants, une extension Markdown doit s’exécuter sur l’hôte distant, car c’est là que le pipeline de rendu Markdown s’exécute. Les extensions telles que Print conçues pour être utilisées avec des espaces de travail distants peuvent être déployées sur l’hôte distant en un seul clic. La plupart des extensions Markdown sont capables de fonctionner comme ça, mais elles ne sont pas configurées pour cela.

Malheureusement, les extensions Markdown ne sont normalement pas configurées pour une utilisation à distance ; les concepteurs s’attendaient à ce qu’ils fonctionnent localement. 

### Patching DIY des extensions Markdown

Si votre besoin est urgent, vous pouvez corriger vous-même les extensions.

1. Trouvez les extensions où elles sont installées sur votre poste de travail dans `~/.vscode/extensions` (sous Windows, remplacez `%userprofile%` par `~`)
2. Modifiez les fichiers `package.json` pour les extensions Markdown que vous souhaitez utiliser sur les hôtes distants. Ajoutez le `extensionKind` comme attribut de niveau racine. 
3. Lorsque vous avez modifié toutes les extensions Markdown, redémarrez VS Code.
4. Installez l’extension sur l’hôte distant et corrigez l’extension sur l’hôte distant de la même manière.

```json
...
"extensionKind": [
  "workspace"
],
...
```

Des correctifs comme celui-ci seront perdus lors de la prochaine mise à jour d’une extension, donc si votre correctif a réussi, vous voudrez peut-être soumettre un PR à l’éditeur.

# Dépannage

## Prérequis

* Commencez par vous assurer que vous pouvez imprimer une page Web à partir de votre navigateur.
* Firefox n’est _pas_ un choix idéal, mais si vous le préférez comme navigateur par défaut, vous serez heureux d’apprendre que vous pouvez configurer l’impression pour utiliser un navigateur non par défaut - vous pouvez l’avoir dans les deux sens.
* L’utilisateur comme lequel VS Code s’exécute doit être en mesure d’établir un socket d’écoute.

## Premiers tracas de lancement
* Rien ne semble se passer - redémarrez VS Code.
* Le navigateur se lance mais aucune page ne se charge - vérifiez les autorisations réseau.
* Le navigateur affiche un message d’erreur sur l’impossibilité de trouver un fichier CSS - vous avez installé à partir d’un VSIX qui n’a pas été préparé par nous. Obtenez le [package officiel] (https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print) et réessayez.

Si quelque chose d’autre ne va pas, ou si vous avez une idée d’amélioration, nous vous invitons à enregistrer un problème sur le référentiel GitHub.

## Choix du navigateur

Le navigateur utilisé affectera votre expérience.  

### Recommandé pour l’impression

Pour de meilleurs résultats d’impression, installez un navigateur basé sur Chromium. Si vous ne souhaitez pas en faire votre navigateur par défaut, profitez des paramètres du navigateur alternatif. 

Les éléments suivants sont connus pour bien fonctionner.
* Courageux
* Chrome
* Chrome
* Bord

### NON recommandé pour l’impression

* Firefox imprime assez bien mais ne ferme pas le navigateur par la suite. 
* Edge Classic n’est plus pris en charge.
* Internet Explorer n’est pas pris en charge.

## Extensions Markdown et communication à distance

Pour utiliser Imprimer avec un hôte distant, vous devez l’installer **sur l’hôte distant**.

Pour bénéficier d’une extension Markdown lors de l’impression d’un document à partir d’un hôte distant, l’extension Markdown doit être construite avec un `extensionKind` de `workspace` _et_ elle doit être installée sur l’hôte distant. 

La plupart de ces extensions ne sont pas conçues pour `workspace`. Ils peuvent être corrigés trivialement en modifiant leur `package.json`. Malheureusement, ce correctif manuel est susceptible d’être perdu chaque fois que l’extension est mise à jour, vous devez donc soulever un problème avec l’auteur des extensions que vous corrigez.

## Autre navigateur

Vous ne pouvez pas fournir d’options de ligne de commande sur l’autre chemin d’accès du navigateur. Sous Windows, nous mettons automatiquement des guillemets autour de votre chemin en cas d’espaces dans les noms de fichiers ou de dossiers. Sur d’autres plateformes, les espaces sont automatiquement échappés.

L’établissement de devis automatique et l’échappement d’espaces sont incompatibles avec l’utilisation des options de ligne de commande. La solution consiste à créer un fichier batch (ou script shell) qui lance le navigateur avec des options de ligne de commande et à fournir le chemin d’accès au fichier batch (ou script shell).

### Chrome et plugins

Chrome peut conserver vos sélections d’imprimante, de format de papier et de marge entre les travaux d’impression. Certaines options de ligne de commande chrome provoquent le signalement d’erreurs, même si l’impression réussit. 

Certains plugins Chrome interfèrent avec le style des travaux d’impression. Alors qu’il est possible de supprimer les plugins avec `--disable-plugins` cela ne fonctionne pas lorsqu’il existe déjà une instance en cours d’exécution de Chrome. L’option `--incognito` supprime les plugins lorsqu’il y a une instance en cours d’exécution, mais a ses propres problèmes.

## Signaler un problème

Si vous n’arrivez toujours pas à faire fonctionner Print, [soulevez un problème sur le référentiel](https://github.com/PDConSec/vsc-print/issues). Nous allons essayer de vous aider.

Nous pouvons vous demander d’augmenter votre niveau de journalisation, de reproduire le problème, puis de nous envoyer le journal.

### Journalisation

Définissez le niveau de journalisation avec le paramètre  `Print: Log Level`. Cela par défaut est `error` (journalisation minimale), mais vous pouvez le transformer en `debug` qui est très détaillé, ou même `silly` qui enregistrera même les appels au garbage collector.
