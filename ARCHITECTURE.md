# Architecture :

### <div style="text-align:center"> - UML du projet</div>

![enter image description here](https://cdn.discordapp.com/attachments/574989139594969109/706647694579335168/Architecture.png)

###  - Structure :
- Le projet est composé de deux grosses parties. La partie front fait avec le module `Express` de `nodeJs`, javascript et les services web `POST` et `GET` pour communiquer avec le serveur. Puis la partie back réalisé avec `NodeJs` ainsi que certains module comme `SaxPath, Natural, fs, stream ...etc` 
la structure du projet est réalisé comme suite :
> - node_modules 
> 	+ /bin
> 	+ /ainsi que tous les modules du projet

> - Public (contient tous les codes sources du front)
> 	+ /css (style en cascade front)
> 	+ /data (nos donnés xml et frwiki)
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
> - pagerank.js --> attribue un score à nos pages.

### Principe de fonctionnement :
On génère un corpus à partir du grand fichier frwiki de ~20 Go  en prenant les 400.000 premières pages en relation avec le domaine de l'informatique, l'intelligence artificielle et la robotique. On construis après le dictionnaire en même temps que le Collector (relation mot-pages) et on sauvegarde le tous dans le fichier collector.xml. Ceci nous permet de gagner en mémoire et en temps d'exécution au lancement du serveur. En effet, parcourir un fichier aussi lourd que le corpus prend énormément de temps et de place mémoire. La même logique s'applique à la génération de graph.xml. 

Une fois nos 3 fichiers XML générés, on peut lancer le serveur et faire une recherche. Pour des raisons de la limite de la mémoire vive de nos ordinateurs, on a décidé de diviser notre Collector en deux. Une partie chargée en mémoire, tandis que l'autre moitié est lu directement depuis le fichier collector.xml. Ceci nous permet d'avoir des résultats instantanés si les mots recherchés sont déjà chargés en mémoire, sinon on est obligé de les chercher sur le fichier et donc la recherche prendra quelques secondes pour trouver un résultat. 

Une fois qu'un résultat est obtenu, on tri les liens par score de pagerank attribué. Ainsi on obtient une liste trié par ordre décroissant (du meilleur score au plus mauvais) en utilisant la fonction pagerank_zap_eps(...).
 
Un mot ne peut avoir que 600 liens comme résultat maximum, par contre le résultat d'une recherche composée est représenté par la somme des liens de tous les mots pertinents.

* exemple:
	* On recherche la phrase : `Algorithme & Géographie`
	* Donc les mots pertinents obtenus sont : `algorithme` , `geographie`.
	* On trouve pour le mot `algorithme` 600 liens et 450 pour `geographie` par exemple (les chiffres sont arbitraire ici).
	* Donc le résultat obtenu a la fin est un total de 1050 liens. on enlève les doublons s'il y en a.
	* Puis on trie les 1050 liens par score de Pagerank et on affiche les 1050 liens de pages Wikipedia trouvés.


Au lancement du serveur, plusieurs composantes du projets se chargent en arrière plan pendant une trentaine de seconde pour créer le graphe, le Collector, la matrice CLI, ainsi que le calcul du Pagerank. Un message de complétion s'affichera lorsque tout est prêt à utilisation. 