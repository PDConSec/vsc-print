# Print extension

[Version français](https://github.com/PeterWone/vsc-print) par Peter Wone

[ENGLISH](README.md) | [FRENCH](README.fra.md) | [Add a language](how-to-add-a-language.md)

## Markdown et code source, stylisé pour l’impression

* Imprimer le code source
* Impression Markdown entièrement rendu

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

### 0.9.9
- Localiser les messages
- Améliorer l’expérience utilisateur des paramètres pour les listes globulaires d’impression de dossiers pour l’exclusion et l’inclusion
- Garantir l’exclusion des types de fichiers non imprimables connus
- Incorporer des feuilles de style et améliorer l’expérience utilisateur des paramètres de feuille de style
- Nouveaux paramètres pour la personnalisation du rendu Markdown

### 0.9.8

- Ajustez le slogan pour vous assurer que la référence à Markdown est toujours visible.
- Mettre en majuscule toutes les références à Markdown dans le fichier readme.
- Supprimer l’application automatique de guillemets au chemin du navigateur alternatif en raison d’une incompatibilité avec Linux.

### 0.9.7

- Correction des ressources manquantes en raison d’une mise à jour défectueuse dans l’outil d’empaquetage et de publication d’extensions de Microsoft (le retour à une version antérieure a résolu les ressources manquantes)

### 0.9.6

- Changer le slogan du marché.

### 0.9.5 

* Mises à jour de sécurité
* Contourner la nouvelle faille dans nodejs. Le gestionnaire d’erreurs est désormais toujours appelé lorsque le navigateur est lancé, et il est nécessaire de vérifier si l’objet error est null. Cela a entraîné le signalement de fausses erreurs même si l’impression réussit.
* Mettez à jour le fichier readme pour promouvoir la capacité (apparemment rare) d’imprimer le Markdown rendu. Merci à Andy Barratt de l’avoir suggéré dans sa revue.

### 0.9.4
- Mettre à jour les actifs pour compenser les modifications apportées au Code Visual Studio 1.56
- Message d’erreur d’affichage PR101 lorsque le lancement du navigateur échoue, corriger grâce à [baincd](https://github.com/baincd)
- PR97 corrige le chemin pour le Markdown rendu, fixer grâce à [baincd](https://github.com/baincd)
- PR97 corrige le réglage de l’interface utilisateur `extensionKind` dans `package.json`, fixer grâce à [baincd](https://github.com/baincd)
- PR96 corrige extensionKind UI réglage dans package.json, fixer grâce à [baincd](https://github.com/baincd)
- PR94 met à jour README pour clarifier les différences significatives entre le navigateur et la recommandation du navigateur, grâce à [baincd](https://github.com/baincd)
- PR92 implémente un délai d’attente pour le serveur Web intégré, grâce à [baincd](https://github.com/baincd)
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

- Problème 64 - images locales ont été brisées parce que Microsoft a modifié VS Code. Le rendu de Markdown ne réécrit plus les références de ressources aux chemins de fichiers préfixés, ils sont maintenant passés par inchangé. L’extension gère désormais le mappage au système de fichiers.

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
