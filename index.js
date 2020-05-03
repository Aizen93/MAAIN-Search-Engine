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
// Démarrage du serveur
serv.use(bodyParser.urlencoded({ extended: true }));
serv.use(express.static(__dirname + '/public'));
serv.set('view engine', 'ejs');
serv.listen(8080, function() {
  console.log("Server started");
});

//-------------------------------------------------------------------//
//------------------------ CODE COLLECTOR ---------------------------//
//-------------------------------------------------------------------//

var collector = new Map();
var search_word = [];

function collectorLauncherMemory(){
  var instream = fs.createReadStream('./collector.xml');
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
          if(collector.get(mot).length < 500){
            let indexOfFirst = line.indexOf('<titre>')+7;
            let indexOfLast = line.indexOf('</titre>') - indexOfFirst;
            let titre = line.substr(indexOfFirst, indexOfLast);
            collector.get(mot).push(titre);
          }
        }
      }
  });

  instream.on('end', function(){
      console.log("total mot : " + collector.size);
    });
}

function collectorLauncherStream(search){
  return new Promise((successCallback, failureCallback) => {
    var instream = fs.createReadStream('./collector.xml');
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
collectorLauncherMemory();

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
function get_by_title(list, str) {
  for (var i = 0; i < list.length; i++) {
    if(str == list[i].title) return list[i]
  }
  return null;
}
function get_by_id(list, id) {
  for (var i = 0; i < list.length; i++) {
    if(id == list[i].id) return list[i]
  }
  return null;
}

function graph() {
  var instream = fs.createReadStream('./graph.xml');
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
    console.log("Graph created succefully !!!");
    calcul_cli();
    affichage_array();
  });
}

//-------------------------------------------------------------------//
//------------------------ END CODE GRAPH ---------------------------//
//-------------------------------------------------------------------//

//-------------------------------------------------------------------//
//-------------------------- CODE CLI -------------------------------//
//-------------------------------------------------------------------//

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

function get_line_matrice(j) {
  var res = new Array();
  var list_indice = new Array();
  var n = 0, indice = 0, nb_elemt = l_array[j+1]-l_array[j];

  for (var i = 0; i < matrice.length; i++) res.push(0);
  if(nb_elemt == 0)   return res;

  while ((n != j) && (indice < i_array.length)) {
    if(i_array[indice] >= i_array[indice+1]) n++;
    indice ++;
  }
  while((i_array[indice] < i_array[indice+1]) && ((indice+1)<i_array.length)) {
    list_indice.push(i_array[indice++]);
  }
  if(indice == i_array.length) indice--;
  list_indice.push(i_array[indice]);
  indice = l_array[j];
  if(nb_elemt == 1) res[list_indice[0]] = c_array[indice];

  for (var i = 0; i < list_indice.length; i++) res[list_indice[i]] = c_array[indice++];

  return res;
}

function affichage_array() {
  console.log("Tableau L : ");
  console.log(l_array);
  console.log("Tableau C : ");
  console.log(c_array);
  console.log("Tableau I : ");
  console.log(i_array);
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

function sortHistory(mot){
  const index = search_word.indexOf(mot);
  if (index > -1) {
    search_word.splice(index, 1);
  }
  search_word.push(mot);
}

function processSearch(req){
  return new Promise((successCallback2, failureCallback) => {
    if(!search_word.includes(req.body.search)) search_word.push(String(req.body.search));
    else sortHistory(req.body.search);

    var mot_compose = cleanSearchWord(search_word[search_word.length-1]);
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
            console.log("res = "+resultat);
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
      console.log("RESULTAT OBTENU");
      if(links == undefined) links = [];
      let resu = links.slice((perPage * page) - perPage, ((perPage * page) - perPage) + 10);
      res.render("pages/index", {history: search_word, data:links.length, list: resu, current: page, pages: Math.ceil(links.length / perPage)});
      }
    );
  
});

//-------------------------------------------------------------------//
//--------------------- END CODE WEB SERVICES -----------------------//
//-------------------------------------------------------------------//