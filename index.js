// Dépendances requises
var express = require('express');
var bodyParser = require('body-parser');
var serv = express();
var Node = require('./Node.js');
var verrou = true;
serv.use(bodyParser.urlencoded({ extended: false }));
serv.set('view engine', 'ejs');
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');
var removePunctuation = require('remove-punctuation');
// Démarrage du serveur

serv.use(express.static(__dirname + '/public'));
serv.listen(8080, function() {
  console.log("Server started");
  //dictionary_array = dictionary();
});
var dictionary_array;
var graph_array = [];
//count = 0;
l_array = [0];
c_array = new Array();
i_array = new Array();
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
  var i = 0;
  var fileStream = fs.createReadStream('./graph.xml');
  var streamer = new saxPath.SaXPath(saxParser, '//page');
  streamer.on('match', function(xml) {
    //parser
    var id = xml.split('<id>')[1].split('</id>')[0];
    var title = xml.split('<title>')[1].split('</title>')[0];
    var string = xml.split('<link>')[1].split('</link>')[0];
    sub1 = '<title>';
    sub2 = '</title>';
    var list_link = string.split(sub1);
    var node = new Node(id, title);
    list_link.forEach((item) => {
      if(item.length > 0) {
        if(item.includes(sub2)) {
          item = item.split(sub2)[0];
          node.add_link(item);
        }
      }
    });
    graph_array.push(node);
    calcul_cli(line_graph(i));
    i++;
  });
  fileStream.on('error', function(){
    console.log("Error parsing file !!!");
  });
  fileStream.on('end', function(){
    fileStream.close();
    console.log("Graph created succefully !!!");
  });
  fileStream.pipe(saxParser);
}

//-------------------------------------------------------------------//
//------------------------ END CODE GRAPH ---------------------------//
//-------------------------------------------------------------------//

//-------------------------------------------------------------------//
//-------------------------- CODE CLI -------------------------------//
//-------------------------------------------------------------------//

function line_graph(i) {
  var result = new Array();
  var d = graph_array[i].links.length;
  graph_array.forEach((item, j) => {
    var bool = false;
    graph_array[i].links.forEach((link, i) => {
      if(item.title === link) bool = true;
    });
    if(bool) result.push(1/d);
    else result.push(0);
  });
  return result;
}

function calcul_cli(list) {
    list.forEach((num, j) => {
      if(num > 0){
        c_array.push(num);
        i_array.push(j);
        count++;
      }
    });
    l_array.push(count);
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

serv.get("/", function (req, res) {
  //res.render("pages/index.ejs", {data:null, list:null});
  affichage_array();
  if(graph_array != undefined) {
    res.render("pages/index.ejs", {data:null, list:graph_array});
  }
  else{
    console.log("Echec de la récupération du graphe...");
    res.render("pages/index.ejs", {data:null, list:null});
  }
});

serv.post("/", function (req, res) {
  var search = String(req.body.search);
  console.log(search);
  //var
  res.render("pages/index", {data: req.body, list:null});
});
