// Dépendances requises
var express = require('express');
var bodyParser = require('body-parser');
var serv = express();
var Node = require('./Node.js');
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');
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

function collectorLauncher(){
  var readline = require('readline');
  var stream = require('stream');

  var instream = fs.createReadStream('./collector.xml');
  var outstream = new stream;
  outstream.readable = true;
  outstream.writable = true;

  var rl = readline.createInterface({
      input: instream,
      output: outstream,
      terminal: false
  });

  var mot;
  rl.on('line', function(line) {
      if(line.includes("</mot>")){
          let indexOfFirst = line.indexOf('">')+2;
          let indexOfLast = line.indexOf('</mot>') - indexOfFirst;
          let m = line.substr(indexOfFirst, indexOfLast);

          collector.set(m, new Array());
          mot = m;
      }
      else if(line.includes("<titre>")){
          if(collector.get(mot).length < 200){
            let indexOfFirst = line.indexOf('<titre>')+7;
            let indexOfLast = line.indexOf('</titre>') - indexOfFirst;
            let titre = line.substr(indexOfFirst, indexOfLast);
            collector.get(mot).push(titre);
          }
      }
  });

  instream.on('end', function(){
      console.log("total mot : " + collector.size);
      //console.log("-------"+collector.get("quot"));
    });
}
collectorLauncher();

//-------------------------------------------------------------------//
//---------------------- END CODE COLLECTOR -------------------------//
//-------------------------------------------------------------------//


var dictionary_array;
var graph_array = [];
//count = 0;
l_array = [0];
c_array = new Array();
i_array = new Array();
var count = 0;
//graph();
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
      c_array.push(1/d);
      if(tmp == undefined) i_array.push(-1);
      else i_array.push(tmp);
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

serv.get("/:page", function (req, res) {
  var perPage = 10;
  var page = req.params.page || 1;
  let tab = collector.get(search_word[search_word.length-1]);
  if(tab == undefined) tab = [];
  let resu = tab.slice((perPage * page) - perPage, ((perPage * page) - perPage) + 10);
  res.render("pages/index", {history: search_word, data:tab.length, list: resu, current: page, pages: Math.ceil(tab.length / perPage)});
});

serv.get("/", function (req, res) {
  //affichage_array();
  var perPage = 10;
  var page = req.params.page || 1;
  let tab = collector.get(search_word[search_word.length-1]);
  if(tab == undefined) tab = [];
  let resu = tab.slice((perPage * page) - perPage, ((perPage * page) - perPage) + 10);
  res.render("pages/index", {history: search_word, data:tab.length, list: resu, current: page, pages: Math.ceil(tab.length / perPage)});
});

function sorthistory(mot){
  const index = search_word.indexOf(mot);
  if (index > -1) {
    search_word.splice(index, 1);
  }
  search_word.push(mot);
}

serv.post("/", function (req, res) {
  if(!search_word.includes(req.body.search)) search_word.push(String(req.body.search));
  else sorthistory(req.body.search);
  var perPage = 10;
  var page = req.params.page || 1;
  let tab = collector.get(search_word[search_word.length-1]);
  if(tab == undefined) tab = [];
  let resu = tab.slice((perPage * page) - perPage, ((perPage * page) - perPage) + 10);
  res.render("pages/index", {history: search_word, data:tab.length, list: resu, current: page, pages: Math.ceil(tab.length / perPage)});
});
