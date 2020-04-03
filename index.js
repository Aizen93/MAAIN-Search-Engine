// Dépendances requises
var express = require('express');
var bodyParser = require('body-parser');
var serv = express();
serv.use(bodyParser.urlencoded({ extended: true }));
serv.set('view engine', 'ejs');
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');
var removePunctuation = require('remove-punctuation');
// Démarrage du serveur
serv.use(express.static(__dirname + '/public'));
serv.listen(8080, function() {
  console.log("Server started");
});

//-------------------------------------------------------------------//
//---------------------- CODE DICTIONNAIRE --------------------------//
//-------------------------------------------------------------------//
var count = 0;
var dictionary_array = new Array();
function dictionary(){
  var fileStream = fs.createReadStream("./corpus.xml");
  var words_occurence = new  Map();
  var streamer = new saxPath.SaXPath(saxParser, '//text');
  var finish = false;

  streamer.on('match', function(xml) {
    if(count<1000){
      console.log(count);
      var texte = removePunctuation(xml.substring(6,xml.length - 7));
      var tab = texte.split(" ");
      tab = filter(tab);
      tab.forEach((item) => {
        const regex = /[&,/<>{}=@0-9*+()-_|]/g;
        const found = item.match(regex);
        if(found == null){
          if(words_occurence.has(""+item)) words_occurence.set(""+item, words_occurence.get(""+item)+1);
          else words_occurence.set(""+item, 1);
        }
      });
      count++;
    }else{
      if(!finish) {
        let mapSort = new Map([...words_occurence].sort(([k, v], [k2, v2])=> {
          if (v < v2)  return 1;
          if (v > v2)  return -1;
          return 0;
        }));
        const iterator = mapSort.keys();
        for (var i = 0; i < 10000; i++) {
          var word = iterator.next().value;
          dictionary_array.push(word);
        }
        dictionary_array.sort();
        console.log("Dictionary created succefully !!!");
        console.log(dictionary_array);
        console.log("Total mots : " + dictionary_array.length);
        finish = true;
      }
    }
  });
  fileStream.on('error', function(){
    console.log("Error parsing file !!!");

  });
  fileStream.on('end', function(){
    console.log("Total mots : " + words_occurence.length);
    const mapSort = new Map([...words_occurence.entries()].sort((a, b) => b[1] - a[1]));
    const iterator = mapSort.keys();
    for (var i = 0; i < 10000; i++) dictionary_array.push(iterator.next().value);

    console.log("Dictionary created succefully !!!");
    console.log(dictionary);
  });
  fileStream.pipe(saxParser);
}

function filter(list) {
  var res = Array();
  list.forEach((elmt,i) => {
    if(elmt.length > 3 && elmt.length < 15 && list.indexOf(elmt) === i){
      res.push(upper_noaccent(elmt));
    }
  });
  return res;
}

function upper_noaccent(word) {
  var accents = require('remove-accents');
  return accents.remove(word.toString().toLocaleLowerCase());
}


//-------------------------------------------------------------------//
//--------------------- END CODE DICTIONNAIRE -----------------------//
//-------------------------------------------------------------------//

serv.get("/", function (req, res) {
  res.render("pages/index.ejs");
    dictionary();
});

serv.post("/", function (req, res) {
  var search = String(req.body.search);
  console.log(upper_noaccent(search));
  res.render("pages/index", {data: req.body});
});
