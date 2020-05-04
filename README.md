# MAAIN-Search-Engine
<div style="text-align:center">Méthodes algorithmiques pour l'accès à l'information numérique, basé sur Wikipédia</div>

## Membres:
-	Aouessar Oussama @aouessar
-	Medjadi Mohamed Ilyesse @medjadi
-	Melila Lilya @melila



## Utilisation:

#### 1. Pré-requis:

- Installation de la dernière version de NodeJS
- Clone du dépôt git via l'une de ces deux commandes: 
  - SSH: `git clone git@gaufre.informatique.univ-paris-diderot.fr:aouessar/wikipedia-search-engine.git`
  - HTTPS: `git clone https://gaufre.informatique.univ-paris-diderot.fr/aouessar/wikipedia-search-engine.git`

#### 2. Générer les fichiers XML:

- Si vous souhaitez tester la génération de fichier dont on a besoin, vous pouvez utiliser les commandes suivantes dans ce même ordre:

  `node corpusgenerator.js <frwiki filepath>`

  `node graphgenerator.js <corpus filepath>`

  `node --max-old-space-size=6096 dictionarygenerator.js <corpus filepath>`

- Sinon, si vous souhaitez accéder à distances, aux trois fichiers XML déjà préparés, voici le lien vers une machine de l'UFR afin de les recuperer :
  - `/info/nouveaux/aouessar/Desktop/maain/corpus.xml`
  - `/info/nouveaux/aouessar/Desktop/maain/graph.xml`
  - `/info/nouveaux/aouessar/Desktop/maain/collector.xml`

#### 3. Lancement du serveur:

- Avant de lancer le serveur, veillez à déplacer les fichiers XML (télécharger) dans le répertoire `/public/data/` du projet.

- Vous pouvez maintenant lancer le serveur via la commande suivante:

  ​	`node index.js <graph filepath> <collector filepath>`

#### 4. Ouvrir un navigateur sur l'adresse locale

​	`localhost:8080`

#### 5. Faire une recherche:

- La barre de recherche se trouve via la loupe en haut a droite de la page d'accueil. Vous y trouverez des suggestions afin de faire votre première recherche et vous pourrez retrouver votre historique de recherche en suggestion par la suite.

  Voici quelques exemples que nous vous suggérons nous-même:

  `Algorithme et Géographie`

  `L'histoire de la France`

  `Géométrie & coordonnée, longitude = 52`