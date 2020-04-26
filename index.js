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
  var fileStream = fs.createReadStream('./graph.xml');
  var start = new Date().getTime();
  var streamer = new saxPath.SaXPath(saxParser, '//page');
  graph_array = new Array();
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
  });
  fileStream.on('error', function(){
    console.log("Error parsing file !!!");
  });
  fileStream.on('end', function(){
    fileStream.close();
    var end = new Date().getTime();
    var time = end - start;
    console.log(end - start);
    console.log("Graph created succefully !!!");
  });
  fileStream.pipe(saxParser);
}

//-------------------------------------------------------------------//
//------------------------ END CODE GRAPH ---------------------------//
//-------------------------------------------------------------------//

serv.get("/", function (req, res) {
  if(graph_array != undefined) {
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
