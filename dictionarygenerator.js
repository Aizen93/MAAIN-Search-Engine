// Dépendances requises
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');
var removePunctuation = require('remove-punctuation');

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

function splitTolink(title){
    var elements = title.split(' ');
    var cpt = 0;
    const link_header = 'https://fr.wikipedia.org/wiki/';
    var link_body ='';
    elements.forEach(element => {
      if(cpt < elements.length-1){ 
        link_body += element+'_'
      }else{
        link_body += element
      }
      cpt++;

    });
    return link_header+link_body;
}

function wordToLink(title){
    var link = 'https://fr.wikipedia.org/wiki/';
    for(var pos = 0; pos < title.length; pos++) {
        var c = title.charAt(pos);
        if(c == ' ' || c == '\t') {
            link+='_';
        }else{
            link+=c;
        }
    };
    return link;
}

dictionary();
//-------------------------------------------------------------------//
//--------------------- END CODE DICTIONNAIRE -----------------------//
//-------------------------------------------------------------------//