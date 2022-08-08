# Print extension

[Version français](https://github.com/PeterWone/vsc-print) par Peter Wone

[ENGLISH](README.md) | [FRANCAISE](README.fra.md) | [DEUTSCH](README.deu.md) | [ESPAGNOLE](README.esp.md) | [中文CHINESE](README.zho.md) | [Add a language](how-to-add-a-language.md)

## Markdown et code source, stylisé pour l’impression

* Imprimer le code source
* Impression Markdown entièrement rendu

_La plupart des défaillances hors boîte sont dues à un regroupage défectueux par des tiers. Si cela vous arrive, procurez-vous le [VSIX produit et vérifié par nous](https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print)._

Le code source obtient les numéros de ligne et la coloration de la syntaxe. Markdown est rendu avec le pipeline de rendu d’aperçu de VS Code &mdash; de nombreuses extensions Markdown fonctionnent avec l’impression.

## Impression indépendante du système d’exploitation

Les travaux d’impression sont rendus au format HTML stylisé et servis à partir d’un serveur Web incorporé. Lorsque vous imprimez, votre navigateur Web local est lancé pour charger le travail d’impression et vous donner des options d’impression telles que l’orientation de la page et la taille de la marge. Donc, si vous avez un navigateur local qui peut imprimer, et VS Code peut le lancer, vous êtes en affaires. Les plates-formes utilisateur connues incluent Windows, Linux et OSX.

### Dépannage au premier lancement

Print a parfaitement fonctionné pour des milliers de personnes prêt à l’emploi, mais parfois les paramètres et les autorisations locaux peuvent gâcher le plaisir. Voici les problèmes que nous avons vus jusqu’à présent. Si quelque chose d’autre ne va pas, ou si vous avez une idée d’amélioration, nous vous invitons à enregistrer un problème sur le référentiel GitHub.

#### Rien ne semble se passer

Si vous essayez d’imprimer et que rien ne se produit, redémarrez VS Code. Si cela ne fonctionne toujours pas, votre système peut avoir un problème de configuration ou d’autorisation qui ne laissera pas le navigateur se lancer. Le navigateur Firefox par défaut sur Ubuntu donne des problèmes hors de la boîte. Installez Chromium (ou Chrome, Edge, Brave...) et faites-en le navigateur par défaut. Si vous ne souhaitez pas faire de Chromium le navigateur par défaut, lisez le manuel pour plus de détails sur l’utilisation d’un navigateur spécifique pour l’impression et utilisez Chromium pour imprimer.

#### Lancement du navigateur mais aucune page ne se charge

Vos paramètres système interfèrent probablement avec le serveur Web intégré. Les paramètres réseau fortement verrouillés peuvent le faire. Il s’agit probablement d’autorisations. Toute personne interférait avec les autorisations réseau doit résoudre ce problème.

#### Le navigateur se lance et affiche un message d’erreur au lieu d’un travail d’impression

Sur les variantes non standard de VS Code, le programme d’installation peut ne pas installer toutes les dépendances. Si tel est le cas, l’erreur concernera de ne pas pouvoir trouver les fichiers CSS. Reportez-vous à https://github.com/PeterWone/vsc-print/issues/116 pour plus de détails et des instructions correctives. Dans certains cas, le problème concerne les autorisations du système de fichiers.

#### Le navigateur se lance et affiche un message d’erreur au lieu d’un travail d’impression

Examinez le message d’erreur. En général, il s’agit d’une sorte d’autorisation refusée sur des systèmes étroitement verrouillés.

## Expérience utilisateur classique

![Toolbar snap with print icon](https://user-images.githubusercontent.com/5498936/53408273-d853d480-3a09-11e9-8936-d37189dce8c5.PNG)

L'icône d'impression sur la barre d'outils imprime le document dans l'éditeur actif.

Si vous avez une sélection de texte qui traverse au moins une ligne-break, vous pouvez cliquer à droite et choisir «Imprimer» dans le menu contextuel pour envoyer seulement la sélection à l'imprimante. En l'absence d'une sélection multi-lignes, le document entière est imprimée. Vous pouvez contrôler la position de `Imprimer` dans ce menu, ou le supprimer complètement.

![context-menu-editor](https://user-images.githubusercontent.com/5498936/53408378-05a08280-3a0a-11e9-8e88-0088089e0d07.png)

Ou vous pouvez cliquer à droite sur un fichier dans le volet explorateur de fichiers et choisir Imprimer dans le menu contextuel.

![context-menu-file-explorer](https://user-images.githubusercontent.com/5498936/53408376-05a08280-3a0a-11e9-9912-31e869db64d5.png)

## Fonctionnalités

Impression sur Mac, Linux et Windows

* Entièrement local en fonctionnement, pas de dépendance à l'égard des services cloud
* Coloration syntaxique dans un large éventail de schémas de couleurs familiers 
* Numérotage de ligne facultatif
* Espacement de ligne réglable (1, 1,5, 2)
* Imprimer une sélection de code avec des numéros de ligne correspondant à l'éditeur
* Spécifier un navigateur autre que votre défaut
* Les documents Markdown sont rendus lorsque vous les imprimez (ou non, il y a un paramètre)

## Exigences

Vous aurez besoin d'un navigateur Web et d'un accès à une imprimante.

Cette extension est testée avec Windows 10 avec les builds actuels de Chrome, Edge et Firefox.
Je ne peux pas tester sur un Mac parce que je n'en possède pas. De même, je n'ai pas de systèmes fonctionnant sous Windows XP, 7 ou 8. Si vous utilisez une autre combinaison, signalez les bogues avec des documents de test et des photos de résultats échoués.

## Paramètres d'extension

L'impression de code VS est hautement configurable. Les paramètres peuvent être modifiés en allant dans Code > Préférences > Paramètres > Extensions > Impression.

**L'examen détaillé de ces paramètres se trouve dans [le manuel](https://github.com/PeterWone/vsc-print/blob/master/manual.fr.md).**

## Choix du navigateur

Le navigateur utilisé affectera votre expérience.  

### Recommandé pour l’impression

Tout navigateur dérivé de Chromium devrait aller bien. Les éléments suivants sont connus pour bien fonctionner.
* Brave
* Chromium
* Chrome
* Edge

### Non recommandé pour l’impression

* Firefox ne ferme pas le navigateur une fois l’impression terminée.
* Edge Classic n’est plus pris en charge.
* Internet Explorer n’est pas pris en charge.

## Problèmes connus

Chrome peut conserver vos sélections d’imprimante, de format de papier et de marge entre les travaux d’impression.

Certaines options de ligne de commande chrome provoquent le signaler des erreurs, même si l’impression réussit.

### Espaces dans les chemins

Sous Windows, vous ne pouvez pas fournir d’options de ligne de commande sur l’autre chemin du navigateur, car nous mettons automatiquement des guillemets autour de votre chemin en cas d’espaces dans les noms de fichiers ou de dossiers. (Sur d’autres plates-formes, l’établissement de devis automatique n’est pas effectué et vous devez échapper manuellement les espaces dans les noms de fichiers et de dossiers.) Contournez ce problème en créant un fichier de commandes dans le même répertoire que l’exécutable du navigateur et utilisez-le pour spécifier les options dont vous avez besoin. Pour le chemin d’accès du navigateur, indiquez le chemin d’accès au fichier de commandes. N’oubliez pas de passer par le paramètre URL.

### Interférence des plugins Chrome

Certains plugins Chrome interfèrent avec le style des travaux d’impression. Bien qu’il soit possible de supprimer les plugins avec '--disable-plugins', cela ne fonctionne pas lorsqu’il existe déjà une instance en cours d’exécution de Chrome. Le commutateur '--incognito' supprime les plugins lorsqu’il y a une instance en cours d’exécution, mais a ses propres problèmes.

Pour de meilleurs résultats, gravez de l’espace disque et installez un autre navigateur tel que Chromium, et utilisez-le pour l’impression. Vous pourrez peut-être obtenir un résultat similaire sans avoir besoin de deux navigateurs en utilisant des profils sur Edge.

### Dépendances Internet indirectes

L’extension Math+Markdown (installe le plugin KaTeX) nécessite une connexion Internet pour les feuilles de style et les polices. Vous devez également configurer une référence de feuille de style. Les détails sont dans le manuel.

## Notes de version

### 0.9.28

- Mettre à jour les références pour éliminer les vulnérabilités.
- Enregistrer les ressources de localisation ES et ZH pour l’interface utilisateur [#145](https://github.com/PDConSec/vsc-print/issues/145)

### 0.9.27

- Corriger l'impression d'une sélection [#142](https://github.com/PDConSec/vsc-print/issues/142)

### 0.9.26

- Tests unitaires et tests d’intégration, avec des modifications de prise en charge étendues.

### 0.9.22 

- Correction du chemin cassé vers « navigateur alternatif » sous Windows

### 0.9.18

- Correction de l’impression de sélection
- Mise à jour mineure de la documentation

### 0.9.16

- Ajouter le paramètre de style Markdown pour les blockquotes (#123)
- Appliquer les paramètres de style Markdown sur tout le reste

### 0.9.15

- Correctif pour #98 - imprimer Markdown rendu à partir de fichiers non enregistrés
- Ajout d’instructions sur la modification des extensions de plug-in Markdown pour leur permettre de travailler avec des hôtes distants.

### 0.9.14

- Correction de bug d’urgence pour l’impression de fichiers non enregistrés
- Correction de bogue d’urgence pour l’impression de fichiers avec Azure Uris qui ne sont pas soutenus par un système de fichiers complet

### 0.9.13

- Correction d’un bug d’urgence pour l’impression d’une sélection

### 0.9.12

- Correction de bug d’urgence pour la résolution des ressources locales référencées par Markdown

### 0.9.11

- Réécriture totale de la gestion des fichiers pour prendre en charge les systèmes de fichiers distants
- Les expressions « glob » peuvent être imbriquées
- Exclusion forcée pour
  - `**/*.{exe,dll,pdb,pdf,hex,bin,png,jpg,jpeg,gif,bmp}` 
  - `{bin,obj}`
- Modification des termes de licence refusant la licence aux personnes qui font négatif commentaires du public sans d’abord lire le manuel ou demander de l’aide sur le Dépôt GitHub

### Reportez-vous au journal des modifications pour un historique complet.
