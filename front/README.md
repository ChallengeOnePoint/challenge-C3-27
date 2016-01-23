# GULP WORK

## Gulp file 5G

Installation des dépendances :
------------------------------
Comment installer les dépendances nécessaires au bon fonctionnement du gulp.

* cd chemin/votre/dossier
* npm install

Lancement du serveur Gulp avec Livereload :
-------------------------------------------
La tache va permettre de débuter le developpement en créant le dossier 'dist/' comprenant tous les fichiers traités, et en lançant un serveur en livereload.

* gulp build

Ajout de SVG à destination d'une custom font :
----------------------------------------------
Permet d'utiliser facilement des icons en créant une typo ainsi que des classes associés en se basant sur les SVGs fournis. Vous retrouverez le CSS de la typo 'icons.css' dans le dossier 'dist/css'.

* Ajouter les SVG dans le dossier Glyphicons
* gulp iconfont

Clean du dossier 'dist/' + export ZIP du projet :
----------------------------------------------
Permet de cleaner le dossier 'dist/' pour ne garder que l'utile puis le ZIP avec le nom indiqué dans le gulpfile et la date d'aujourd'hui.
Si le dossier zip porte le même nom, cette tache supprimera l'ancien pour remettre le zip à jour avec le même nom.

* gulp export

## À AMÉLIORER
* S'occuper du JS