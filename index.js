// Dépendances requises
var express = require('express');
var bodyParser = require('body-parser');
var serv = express();
var Node = require('./Node.js');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var accents = require('remove-accents');
var natural = require('natural');

//Test arguments
var argv = process.argv.slice(2);
if(argv.length != 2){
  console.log("Erreur d'arguments, voici un exemple :");
  console.log("- node index.js public/data/graph.xml public/data/collector.xml");
  process.exit();
}
var graph_url = argv[0];
var collector_url = argv[1];

// Démarrage du serveur
serv.use(bodyParser.urlencoded({ extended: true }));
serv.use(express.static(__dirname + '/public'));
serv.set('view engine', 'ejs');
serv.listen(8080, function() {
  console.log("Server started");
  console.log("Please wait for the components to be loaded...");
});

//-------------------------------------------------------------------//
//------------------------ CODE COLLECTOR ---------------------------//
//-------------------------------------------------------------------//

var collector = new Map();
var search_word = [];
var pagerank_array = [];

/**
  Parcours le fichier collector.xml
  garde en mémoire les 6500 derniers mots (sur 10000 mots au total) enregistrés dans le fichier.
*/
function collectorLauncherMemory(){
  var instream = fs.createReadStream(collector_url);
  var outstream = new stream;
  outstream.readable = true;
  outstream.writable = true;
  var count = 0;
  var rl = readline.createInterface({
      input: instream,
      output: outstream,
      terminal: false
  });

  var mot;
  rl.on('line', function(line) {
      if(line.includes("</mot>")){
        if(count >= 3500){
          let indexOfFirst = line.indexOf('">')+2;
          let indexOfLast = line.indexOf('</mot>') - indexOfFirst;
          let m = line.substr(indexOfFirst, indexOfLast);

          collector.set(m, new Array());
          mot = m;
        }
        count++;
      }
      else if(line.includes("<titre>")){
        if(count > 3500){
          if(collector.get(mot).length < 200){
            let indexOfFirst = line.indexOf('<titre>')+7;
            let indexOfLast = line.indexOf('</titre>') - indexOfFirst;
            let titre = line.substr(indexOfFirst, indexOfLast);
            collector.get(mot).push(titre);
          }
        }
      }
  });

  instream.on('end', function(){
    console.log("collector loaded successfully...");
      var z = new Array();
      for (var i = 0; i < graph_array.length; i++) z.push(1);
      var pagerank = require('./pagerank.js');
      /** 
      * Les valeurs de zap et epsilon (0.1 et 10), ont ete choisi apres plusieurs essais. 
      * Ces valeurs sont celles qui nous ont permis d'avoir un bon ratio entre
      * temps d'execution correcte et une fiabilité de nos resultats de recherche.
      */
      pagerank_array = pagerank.pagerank_zap_eps(c_array, l_array, i_array, z, 0.1, 10);
      console.log("PageRank calculated successfully");
      console.log("All components are ready !!!");
    });
}

/**
  Parcours le fichier collector.xml
  cherche sur les 3500 premiers mots (sur 10000 mots au total)
  si les elements dans search en font partie
*/
function collectorLauncherStream(search){
  return new Promise((successCallback) => {
    var instream = fs.createReadStream(collector_url);
    var outstream = new stream;
    outstream.readable = true;
    outstream.writable = true;
    var count = 0;
    var rl = readline.createInterface({
        input: instream,
        output: outstream,
        terminal: false
    });

    let mot;
    let res = [];
    let finished = false;
    let c = 0;
    rl.on('line', function(line) {
      if(count <= 3500 && !finished){
        if(line.includes("</mot>")){
            let indexOfFirst = line.indexOf('">')+2;
            let indexOfLast = line.indexOf('</mot>') - indexOfFirst;
            let m = line.substr(indexOfFirst, indexOfLast);
            if(search.includes(m)){
              search.filter(word => word != m);
              mot = m;
              c += 600;
            }
            count++;
        }
        else if(line.includes("<titre>")){
          if(mot != undefined){
            if(res.length < c){
              let indexOfFirst = line.indexOf('<titre>')+7;
              let indexOfLast = line.indexOf('</titre>') - indexOfFirst;
              let titre = line.substr(indexOfFirst, indexOfLast);
              res.push(titre);
            }else{
              if(search.length == 0){
                instream.close();
                finished = true;
                successCallback(res);
              }
            }
          }
        }
      }else{
        if(!finished){
          instream.close();
          finished = true;
          successCallback(res);
        }
      }
    });
  });
}

//-------------------------------------------------------------------//
//---------------------- END CODE COLLECTOR -------------------------//
//-------------------------------------------------------------------//


var dictionary_array;
var graph_array = [];
var indice_title = new Map();
var l_array = [], c_array = [], i_array = [];
var count = 0;
graph();
//-------------------------------------------------------------------//
//-------------------------- CODE GRAPH -----------------------------//
//-------------------------------------------------------------------//

/**
  Parse graph.xml et crée le graphe en mémoire
*/
function graph() {
  var instream = fs.createReadStream(graph_url);
  var outstream = new stream;
  outstream.readable = true;
  outstream.writable = true;

  var rl = readline.createInterface({
      input: instream,
      output: outstream,
      terminal: false
  });
  var node, id, title,boolean_link = false, list_link;
  var indice = 0;
  var count = 0;
  rl.on('line', function(line) {
    if(line.includes('<id>')) id = line.split('<id>')[1].split('</id>')[0];
    else if(line.includes('<title>')) {
      let indexOfFirst = line.indexOf('<title>')+7;
      let indexOfLast = line.indexOf('</title>') - indexOfFirst;
      if(boolean_link) {
        node.add_link(line.substr(indexOfFirst, indexOfLast));
      }else{
        title = line.substr(indexOfFirst, indexOfLast);
        node = new Node(id, title);
        count++;
      }
    }
    else if(line.includes('<link>')) boolean_link = true;
    else if(line.includes('</link>')){
      graph_array.push(node);
      indice_title.set(title, indice);
      indice++;
      boolean_link = false;
    }
  });
  instream.on('end', function(){
    console.log("Graph loaded successfully...");
    calcul_cli();
    console.log("CLI calculated successfully...");
    collectorLauncherMemory();
  });
}

//-------------------------------------------------------------------//
//------------------------ END CODE GRAPH ---------------------------//
//-------------------------------------------------------------------//

//-------------------------------------------------------------------//
//-------------------------- CODE CLI -------------------------------//
//-------------------------------------------------------------------//
/**
  Calcul le CLI et le garde en mémoire
*/
function calcul_cli() {
  var size = graph_array.length;
  l_array = [0];
  c_array = new Array();
  i_array = new Array();
  for (var i = 0; i < size; i++) {
    var links_list = graph_array[i].links;
    var d = links_list.length;
    for (var j = 0; j < d; j++) {
      var tmp = indice_title.get(links_list[j]);
      if(tmp != undefined){
        c_array.push(1/d);
        i_array.push(tmp);
      }
      count++;
    }
    l_array.push(count);
  }
}

//-------------------------------------------------------------------//
//------------------------ END CODE CLI -----------------------------//
//-------------------------------------------------------------------//

//-------------------------------------------------------------------//
//---------------------- CODE WEB SERVICES --------------------------//
//-------------------------------------------------------------------//
var links = [];
serv.get("/:page", function (req, res) {
  var perPage = 10;
  var page = req.params.page || 1;
  let resu = links.slice((perPage * page) - perPage, ((perPage * page) - perPage) + 10);
  res.render("pages/index", {history: search_word, data:links.length, list: resu, current: page, pages: Math.ceil(links.length / perPage)});
});

serv.get("/", function (req, res) {
    res.render("pages/index", {history: search_word, data:links.length, list: links, current: 0, pages: 0});
});

function lower_noaccent(word) {
  return accents.remove(word.toString().toLocaleLowerCase());
}
/**
 permet de retourner un tableau contenant les mots pertinent de la recherche.
*/
function cleanSearchWord(word){
  if(word.length > 3 && word.length <= 60){
    let item = lower_noaccent(word);

    var tokenizer = new natural.AggressiveTokenizerFr();
    var tab = tokenizer.tokenize(item);
    const regex = /[&,/<>{}=@0-9*+()-_|\n]/g;
    for(var i = 0; i <tab.length; i++) {
      if(tab[i].length < 3 || tab[i].match(regex)){
        const index = tab.indexOf(tab[i]);
        if (index > -1) {
          tab.splice(index, 1);
          i -= 1;
        }
      }
    }
    return tab;
  }
}
/**
  Permet de trier l'historique des recherches par ordre de recherche
*/
function sortHistory(mot){
  const index = search_word.indexOf(mot);
  if (index > -1) {
    search_word.splice(index, 1);
  }
  search_word.push(mot);
}
/**
  Recherche les mots dans le collector et retourne une liste de liens
*/
function processSearch(req){
  return new Promise((successCallback2) => {
    if(!search_word.includes(req.body.search)) search_word.push(String(req.body.search));
    else sortHistory(req.body.search);

    var mot_compose = cleanSearchWord(search_word[search_word.length-1]);
    if(mot_compose == undefined) mot_compose = [];
    mot_compose.forEach(element => {
      let tmp = collector.get(element);
      if(tmp != undefined){
        links = links.concat(tmp);
        mot_compose = mot_compose.filter(word => word != element);
      }
    });

    if(mot_compose.length != 0){
      const promise = collectorLauncherStream(mot_compose);
      promise.then(function successCallback(resultat){
          if(resultat != undefined){
            links = links.concat(resultat);
            links = links.filter((a, b) => links.indexOf(a) === b);
            successCallback2(links);
          }
        }
      );
    }else{
      links = links.filter((a, b) => links.indexOf(a) === b);
      successCallback2(links);
    }
  });
}

serv.post("/", function (req, res) {
  var perPage = 10;
  var page = req.params.page || 1;
  links = [];
  const promise = processSearch(req);
    promise.then(function successCallback2(resultat){
      if(links == undefined) links = [];
      else{
        pagerank_array.sort((n1,n2) => {
          	var indice1 = pagerank_array.indexOf(n1);
            var indice2 = pagerank_array.indexOf(n2);
          	if(n1 < n2 && links[indice1]!=undefined && links[indice2]!=undefined) {
            	var tmp =  links[indice1];
              links[indice1] = links[indice2];
              links[indice2] = tmp;
            }
        });
      }
      let resu = links.slice((perPage * page) - perPage, ((perPage * page) - perPage) + 10);
      res.render("pages/index", {history: search_word, data:links.length, list: resu, current: page, pages: Math.ceil(links.length / perPage)});
      }
    );
});

//-------------------------------------------------------------------//
//--------------------- END CODE WEB SERVICES -----------------------//
//-------------------------------------------------------------------//
