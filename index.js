// Dépendances requises
var express = require('express');
var bodyParser = require('body-parser');
var serv = express();
var test = require('./test');
var Node = require('./Node.js');

serv.use(bodyParser.urlencoded({ extended: true }));
serv.set('view engine', 'ejs');
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');
var removePunctuation = require('remove-punctuation');
// Démarrage du serveur
// graph.graph();;
var dictionary_array;
var graph_array;
serv.use(express.static(__dirname + '/public'));
serv.listen(8080, function() {
  console.log("Server started");
  //dictionary_array = dictionary();
});

serv.get("/", function (req, res) {
  //graph_array = [];
  //graph_array.push(new Node(10,"Algorithme"));
  //graph_array.push(new Node(11,"Algorithmique"));

  if(graph_array.length != undefined) {
    console.log("taille du graphe : "+graph_array.length);
    res.render("pages/index.ejs", {list:graph_array});
  }
  else{
    console.log("Graphe en cours de récupération...");
    console.log(test.graph_array);
    res.render("pages/index.ejs", {list:null});
  }
    //dictionary();
});

serv.post("/", function (req, res) {
  var search = String(req.body.search);
  console.log(upper_noaccent(search));
  res.render("pages/index", {data: req.body});
});

function main() {
  graph_array = test.graph();
  console.log("indice 0 : "+graph_array[0]);
}
main();
