# Comment ajouter une langue

[Version francais] (https://github.com/PeterWone/vsc-print) de Peter Wone

1. Ouvrez [le référentiel vscode-print] (https://github.com/PeterWone/vsc-print).
1. Connectez-vous à GitHub.
1. Fourcez le référentiel et clonez votre fourche sur votre ordi.
1. À la racine du référentiel, il y a un répertoire 'i18n'. Il contient un répertoire subordonné pour chaque langue prise en charge. Le schéma de nommage est ISO639-3 et ce n’est pas négociable. [Recherchez le code à trois lettres de votre langue à l’aide de ce site Web.] https://iso639-3.sil.org/code_tables/639/data) 
1. Créez un répertoire avec ce nom ('eng' pour l’Anglais, 'fra' pour Français etc.) en tant qu’enfant immédiat du repertoire 'i18n'.
1. Copiez le fichier 'packagei18n.json' du répertoire '/i18n/eng' dans le répertoire que vous venez de créer pour votre langue.
1. Utilisez un éditeur compatible UTF8 (VS Code est un bon choix) pour modifier ce fichier.
1. Remplacez chaque chaîne anglaise par votre traduction.
   * La traduction du jargon et des termes techniques est délicate mais vous êtes un expert en la matière, alors demandez-vous: Que verrais-je dans mon code source? Comment puis-je écrire cela par e-mail à un autre programmeur?
   * NE PAS traduire les clés (noms d'attributs).
1. Traduisez 'README.md' et 'manual.md' en 'README.xyz.md' et 'manual.xyz.md' où xyz est votre code de langue.
1. Ce n’est probablement pas la peine de traduire ce fichier à moins que vous ne vous attendiez sérieusement à une traduction de votre langue à une autre.
1. Enregistrez, mettez en scène (git stage), validez et poussez vos modifications dans votre fork sur GitHub.
1. Soulevez un PR pour me dire de fusionner vos mises à jour dans la prochaine version.
1. Enregistrez votre langue dans 'gulpfile.js afin qu’elle soit construite

Je vous encourage à vous créditer pour la traduction dans une ligne au début de chaque document sous la rubrique principale. Il est possible de faire de votre nom un lien de messagerie, mais il n’y a pas besoin puisque les gens peuvent utiliser votre fork pour soulever des problèmes.