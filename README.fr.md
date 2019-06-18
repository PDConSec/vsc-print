# Visual Studio Code Printing

> Je n'ai jamais Français parlé avec talent. Il s'agit essentiellement d'une traduction automatique avec des corrections manuelles où il était si mauvais, même je savais que c'était mal. Si vous êtes prêt et capable de faire un meilleur travail n'hésitez pas à faire un PR.
>
>En particulier, je ne connais pas les traductions idiomatiques pour les éléments d'interface utilisateur comme «Print», «Browse for stylesheet» ou «tab».


![Toolbar snap with print icon](https://user-images.githubusercontent.com/5498936/53408273-d853d480-3a09-11e9-8936-d37189dce8c5.PNG)

L'icône d'impression sur la barre d'outils imprime le document dans l'éditeur actif.

Si vous avez une sélection de texte qui traverse au moins une ligne-break, vous pouvez cliquer à droite et choisir «Imprimer» dans le menu contextuel pour envoyer seulement la sélection à l'imprimante. En l'absence d'une sélection multi-lignes, l'intégralité du document est imprimée. Vous pouvez contrôler la position de 'Print' dans ce menu, ou le supprimer complètement.

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

## Paramètres d'extension

L'impression de code VS est hautement configurable. Les paramètres peuvent être modifiés en allant dans Code > Préférences > Paramètres > Extensions > Impression.

**L'examen détaillé de ces paramètres se trouve dans [le manuel](https://github.com/PeterWone/vsc-print/blob/master/manual.md).**

## Problèmes connus

Rendre la tabulation imprimée respecter le paramètre de taille de tabulation de l'éditeur dépend de la propriété expérimentale `tab-size` CSS. Cela ne fonctionne pas sur Edge. Lorsque Edge commence à utiliser pour son coeur «Chromium», le problème disparaît.

Chrome se souvient trop des imprimantes, de la taille du papier et des marges, surtout si vous avorez.

KaTeX nécessite une connexion Internet. Vous devez également configurer une référence d'une feuille de style. Les détails sont dans le manuel.

## Notes de version

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

Les feuilles de style de schéma de couleurs ne sont plus sélectionnées à partir d'une boîte combo. Au lieu de cela, il ya une nouvelle commande `Imprimer: Parcourir pour la feuille de style` qui engendre un dialogue de fichiers-parcourir et met à jour le paramètre. Si vous choisissez un fichier en dehors du cache de feuille de style, il est copié dans le cache afin que vous ne devenez pas dépendant des ressources locales du réseau.

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
