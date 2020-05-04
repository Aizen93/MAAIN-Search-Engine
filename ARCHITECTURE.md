# Architecture :

### UML du projet :

![enter image description here](https://cdn.discordapp.com/attachments/574989139594969109/706647694579335168/Architecture.png)

### Structure :
- Le projet est composé sur deux grosse partie. La partie front fait avec le module `Express` de `nodeJs`, javascript et les services web `POST` et `GET` pour communiquer avec le serveur. Puis la partie Back réalisé avec `NodeJs` ainsi que certains module comme `SaxPath, Natural, fs, stream ...etc` 
la structure du projet est réalisé comme suite :
> - node_modules 
> 	+ /bin
> 	+ /ainsi que tous les modules du projet

> - Public (contient tous les codes sources du front)
> 	+ /css (style en cascade front)
> 	+ /data (tous nos donnés xml et frwiki)
> 	+ /fonts 
> 	+ /img
> 	+ /js (javascript front qui rend nos pages "responsive")

> - Views (contient nos page html)
> 	+ /pages
> 		+ /index.ejs (notre page de recherche)

> - corpusgenerator.js --> construis le fichier corpus.xml ~2.5Go avec 400.000 pages
> - graphgenerator.js --> construis le fichier graph.xml ~370Mo
> - dictionarygenerator.js --> construis le fichier collector.xml ~300Mo avec 10.000 mots
> - Node.js
> - pagerank.js

### Principe de fonctionnement :
On génère un corpus a partir du grand fichier frwiki de ~18Go  en prenant les 400.000 premières pages en relation avec le domaine de l'informatique, intelligence artificielle et robotique. On construis après le dictionnaire en même temps que le collector (relation mot-page) et on sauvegarde le tous dans le fichier collector.xml. Ceci nous permet de gagner en mémoire et en temps d'exécution au lancement du projet parce que parcourir un fichier aussi lourd que le corpus prend énormément de temps et de place mémoire, pareil pour le graph.xml. Une fois nos 3 fichiers xml généré, on peux lancer le serveur et faire une recherche. Pour des raisons de limite de mémoire RAM de nos ordinateurs on as décidé de diviser notre collector en deux, une partie est chargé en mémoire tandis que l'autre moitié on le lis directement depuis le fichier collector.xml ceci nous permet d'avoir des résultat instantané si les mots recherché sont déjà chargé en mémoire sinon on est obligé de les chercher sur le fichier et donc la recherche prendra quelques secondes pour trouver un résultat. Une fois qu'on as un résultat on tri les liens par score de pagerank attribué, ainsi on obtient une liste trié par ordre décroissant (du meilleur score au plus mauvais) en utilisant la fonction pagerank_zap_eps. 
Chaque mot ne peux avoir que 600 liens comme résultat maximum, par contre le résultat d'une recherche composé c'est la somme de tous les mots pertinent.

* exemple:
	* on recherche la phrase : (algébre et géometrie euclidienne)
	* donc les mots pertinent obtenue sont : algebre, geometrie, euclidienne.
	* On trouve pour le mot "algebre" 600 liens, 250 pour "geometrie" et 150 pour "euclidienne" par exemple (les chiffres sont arbitraire ici).
	* Donc le résultat obtenue a la fin est un total de 1000 liens. on enlève les doublons si y'en as.
	* Puis on trie les 1000 liens par score de pagerank et on affiche les 1000 liens de page Wikipedia trouvé.