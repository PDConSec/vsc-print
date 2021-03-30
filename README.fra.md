# Visual Studio Code Printing

[Version français](https://github.com/PeterWone/vsc-print) par Peter Wone

[ENGLISH](README.md) | [FRENCH](README.fra.md) | [Add a language](how-to-add-a-language.md)



![Toolbar snap with print icon](https://user-images.githubusercontent.com/5498936/53408273-d853d480-3a09-11e9-8936-d37189dce8c5.PNG)

L'icône d'impression sur la barre d'outils imprime le document dans l'éditeur actif.

Si vous avez une sélection de texte qui traverse au moins une ligne-break, vous pouvez cliquer à droite et choisir «Imprimer» dans le menu contextuel pour envoyer seulement la sélection à l'imprimante. En l'absence d'une sélection multi-lignes, le document entière est imprimée. Vous pouvez contrôler la position de `Imprimer` dans ce menu, ou le supprimer complètement.

![context-menu-editor](https://user-images.githubusercontent.com/5498936/53408378-05a08280-3a0a-11e9-8e88-0088089e0d07.png)

Ou vous pouvez cliquer à droite sur un fichier dans le volet explorateur de fichiers et choisir Imprimer dans le menu contextuel.

![context-menu-file-explorer](https://user-images.githubusercontent.com/5498936/53408376-05a08280-3a0a-11e9-9912-31e869db64d5.png)

## Fonctionnalités

Impression sur Mac, Linux et Windows

* Entièrement local en fonctionnement, pas de dépendance à l'égard des services cloud
* Coloration syntaxique dans un large éventail de schémas de couleurs familiers que vous pouvez importer ou modifier
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

## Problèmes connus

Rendre la tabulation imprimée respecter le paramètre de taille de tabulation de l'éditeur dépend de la propriété expérimentale `tab-size` CSS. Cela ne fonctionne pas sur Edge Classique. 

Chrome se souvient trop des imprimantes, de la taille du papier et des marges, surtout si vous avorez.

KaTeX nécessite une connexion Internet. Vous devez également configurer une référence d'une feuille de style. Les détails sont au manuel.

## Notes de version

### 0.9.3
- Autres mises à jour pour le support linguistique
- Problème 88 Essayer d’imprimer un nouveau fichier qui n’existe pas dans le système de fichiers provoquerait un message d’erreur, une régression causée par des changements internes à l’appui de l’impression d'un repértoire, corrigé grâce à [baincd](https://github.com/baincd)
- Problème 87 Les lignes blanches n’impriment pas correctement, corrigé grâce à [baincd](https://github.com/baincd)

### 0.9.2
- Corrigez l’omission des mises à jour de documentation pour 0.9.0 et des traductions manquantes Français.

### 0.9.0
- Diverses dépendances mises à jour pour atténuer les risques pour la sécurité.
- Correction de coloration-syntactique pour chaînes (strings) et commentaires multi-lignes, grâce à [gji](https://github.com/gji) ferme #85 et #63
- Modification de la feuille de style par défaut par rapport à 2015 (un thème sombre) en Atelier Dune.
- Prise en charge supplémentaire de l’impression de dossiers entiers grâce à [alainx277](https://github.com/Alainx277).

### 0.8.3

- Mise à jour `highlight.js` à la dernière version sur les conseils des gardiens de `highlight.js`.
  - Suppression des vulnérabilités potentielles aux documents HTML contenant du script toxique
  - Aborde les problèmes mineurs de colorisation (voir #63)

### 0.8.2

- Suppression du paramètre d’annonce d’acquisition de port car les ports ne sont plus sous le contrôle de l’utilisateur.
- Problème corrigé 68, une exception se produisant lors de l’impression d’une mémoire tampon de l’éditeur qui n’a pas de fichier correspondant sur le disque, en tapant la commande.

### 0.8.1

- Étant donné que le système d’exploitation hôte choisit désormais le port du serveur web intégré, le serveur web est créé lors de la première utilisation et conservé jusqu’à ce que l’extension se désactive, de sorte que l’allocation de port ne change pas. Code pour déclasser le serveur Web après le traitement d’une demande n’a pas été supprimé dans 0.8.0 et est supprimé dans 0.8.1 supprimant le risque d’un changement inattendu de port.

### 0.8.0

- Divers rapports de problème décrivant l’utilisation élevée de processeur au démarrage d’extension sont résolus par l’utilisation de Webpack. 
- La sélection de port pour le serveur web intégré est maintenant entièrement déléguée au système d’exploitation hôte. Par conséquent, les paramètres de plage de sélection de ports ne sont plus nécessaires et ont été supprimés.
- Ne plus dépendre du paquet npm portfinder.

### 0.7.15

- Problème 64 - images locales ont été brisées parce que Microsoft a modifié VS Code. Le rendu de balisage ne réécrit plus les références de ressources aux chemins de fichiers préfixés, ils sont maintenant passés par inchangé. L’extension gère désormais le mappage au système de fichiers.

### 0.7.14

- Problème 51 - ajouter configuration à l’appui de WSL, courtoisie de [sburlap] (https://github.com/sburlappp)
- Problème 54 - respecter la police de caractères de l’éditeur lors de l’impression de code

### 0.7.13

- Problème 48 - corriger MD problème de chemin d'image.
- Mettre à jour les dépendances pour traiter les vulnérabilités connues.

### 0.7.12

- Problème 40 - empêcher l'extension de double fichier produisant une exception non gérée dans le générateur de page de caler le serveur Web intégré résultant en une fenêtre de navigateur blanc vide pour une charge de page qui ne se termine pas.
- Problème 41 - gérer les exceptions inattendues dans le générateur de pages en livrant la pile d'erreurs comme le contenu de la page, améliorant ainsi considérablement les informations diagnostiques dans les questions.

### 0.7.11

- Problème 39 - correction à l'expression régulière mal étendue causant des colons d'être échappé dans le document entier quand ils devraient être échappés seulement dans les URL.

### 0.7.9

- Problème 36 - le pipeline de rendu interne réécrivait des URL pour utiliser un protocole interne vscode. En effet, les références d'image ont fonctionné correctement avec la fenêtre de prévisualisation, mais pas avec le navigateur.

### 0.7.8

- Problème 35 - chemin de cache de stylesheet incorrectement construit sur les systèmes de fichiers non Windows. Ceci a été corrigé.

### 0.7.7
- Problème 33 - le réglage de la taille de l'onglet de l'éditeur a été mal récupéré et n'a donc pas été respecté. Cela a maintenant été corrigé.
- Problème 34 - l'impression était défaillante pour invocation directe (appuyez sur `F1` puis tapez Impression: Imprimer enfin puis appuyez sur `Enter`). Cela a été corrigé.

### 0.7.6
- Traduction à Français.
- La "localisation" russe est un talon (toujours en anglais) en attente de traductions.
- La disponibilité du menu et de l'icône est désormais déterminée à partir de `editorLangId` plutôt que de `resourceLangId`. Cela devrait permettre l'impression de documents non enregistrés et de types de fichiers non reconnus par #31 et #32.

### 0.7.1
Utilise maintenant le convertisseur Markdown intégré.
- charge plus rapide
- réduction de l'utilisation de la mémoire
- les extensions de balisage comme [Markdown+Math](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath) affectent l'impression.

### 0.7.0
- Ajuster la version mineure parce que 0.6.13 introduit de nouveaux paramètres modifiant l'UX
- Corriger le support pour les ensembles de caractères étendus et les langues mélangées dans le #29 code source imprimé avec merci à Ekgart Vikentiy pour le rapport de cette.

### 0.6.13

Stub release because there's no other way to patch the readme.

### 0.6.12

- Paramètres permettant à l'utilisateur de déplacer la plage dans laquelle le serveur Web intégré choisit les ports
- Gamme de port par défaut décalée dans la plage correcte pour les ports dynamiques (était par défaut de bibliothèque)
- Manuel extrait du readme grâce à Nat Kuhn

### 0.6.9

- UTF-8 pour les ensembles de caractères étendus.
- Prise en charge des images sur le stockage local.

[ac WEB DESIGN](http://www.ac-webdesign.ch/) a signalé ces deux problèmes et fourni du contenu de test.

### 0.6.8

- Contrôler si le serveur Web intégré annonce quel port il acquiert (inactif par défaut).
- Utilisez la bibliothèque MarkdownIt.

### 0.6.7

Signalez le port acquis à l'utilisateur avec Windows «toast».

### 0.6.5

- La position du menu contextuel est désormais un paramètre.
- Nouvelle illustration pour Microsoft Store.

### 0.6.2

Correction aux catégories de commande afin qu'elles apparaissent comme

- Imprimer: Parcourir pour la feuille de style
- Imprimer: Imprimer

Les commandes sont présentes et fonctionnelles en 0.6.1 mais ne sont pas correctement catégorisés.

Les feuilles de style de schéma de couleurs ne sont plus sélectionnées à partir d'une boîte combo. Au lieu de cela, il ya une nouvelle commande `Imprimer: Parcourir les feuilles de styles` qui engendre un dialogue de fichiers-parcourir et met à jour le paramètre. Si vous choisissez un fichier en dehors du cache de feuille de style, il est copié dans le cache afin que vous ne devenez pas dépendant des ressources locales du réseau.

Les versions antérieures ont parfois eu des problèmes avec les collisions de bâbord causant l'impression à l'échec. Une réessayer manuel ou trois toujours fixé, mais c'était laid. La correction du problème était l'objectif principal de 0.5.3, et je suis heureux de l'enlever finalement des questions connues.

Il s'agit également de [problème #17](https://github.com/PeterWone/vsc-print/issues/17) qui déplace la responsabilité de la détection des langues de highlightjs (la bibliothèque utilisée pour la coloration syntaxe) au code VS, retombant à highlightjs lorsqu'un code linguistique incompatible est produit.

Microsoft Edge demande toujours la permission de fermer le navigateur après l'impression, ce qui peut être ennuyeux.
Firefox n'invite pas, il est tout simplement ne ferme pas le navigateur, ce qui est au-delà ennuyeux. Par conséquent, les navigateurs dérivés du Chromium sont recommandés pour l'impression.

### 0.6.2

Appliquer des catégories aux commandes.

### 0.6.1

Ajustement de la documentation.

### 0.6.0

- Le réglage de la feuille de style de schéma de couleur n'est plus présenté comme une boîte combo. Au lieu de cela, il ya une commande qui présente un dialogue de fichier-navigation et met à jour le paramètre.
- La détection de la langue revient à highlightjs lorsque VS Code génère un identifiant de langage incompatible.

### 0.5.3

- La taille de l'onglet respecte le réglage de l'éditeur.
- La responsabilité de la détection de la langue est passée du highlightjs au code VS.
