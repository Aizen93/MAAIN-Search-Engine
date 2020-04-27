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
var mot_page = new Map();
var NBRPAGES = 700000;


function dictionary(){
  var fileStream = fs.createReadStream("./corpus.xml");
  var words_occurence = new  Map();
  var streamer = new saxPath.SaXPath(saxParser, '//page');
  var finish = false;

  streamer.on('match', function(xml) {
    if(count < NBRPAGES){
      var title = xml.split('<title>').pop().split('</title>')[0];      
      console.log("page :"+count+" titre :"+title+"\n______________________________________\n");

      var text = xml.split('<text xml:space="preserve">').pop().split('</text>')[0];

      var texte = removePunctuation(text.substring(6, text.length - 7));
      var tab = texte.split(" ");
      tab = filter(tab);
      tab.forEach((item) => {
        const regex = /[&,/<>{}=@0-9*+()-_|\n]/g;
        const found = item.match(regex);
        if(found == null){
          if(words_occurence.has(""+item) && mot_page.has(""+item)){
            words_occurence.set(""+item, words_occurence.get(""+item)+1);
            let tmp = mot_page.get(""+item);
            if(!tmp.includes(title)){
              tmp.push(title);
              mot_page.set(""+item, tmp);
            }
          } else{
            words_occurence.set(""+item, 1);
            let tmpp = new Array();
            tmpp.push(title);
            mot_page.set(""+item, tmpp);
          }
        }
      });
      count++;
    }else{
      if(!finish) {
        console.log("total words before sort :"+words_occurence.size)
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
        console.log("streamer Dictionary created succefully !!");
        console.log(dictionary_array);
        console.log("streamer Total mots : " + dictionary_array.length);
        finish = true;
        fileStream.close();
        generateCollector();
      }
    }
  });
  streamer.on('error', function(){
    console.log("Error parsing file !!!");

  });
  fileStream.on('error', function(){
    console.log("Error parsing file !!!");

  });
  fileStream.on('end', function(){
    console.log("fileStream Total mots : " + words_occurence.size);
    const mapSort = new Map([...words_occurence.entries()].sort((a, b) => b[1] - a[1]));
    const iterator = mapSort.keys();
    for (var i = 0; i < 10000; i++) dictionary_array.push(iterator.next().value);

    console.log("Dictionary created succefully !!!");
    console.log(dictionary_array);
    generateCollector();
  });
  fileStream.pipe(saxParser);
}

function generateCollector(){
  console.log("generating collector ....");
  var collector_stream = fs.createWriteStream("./collector.xml", {flags:'a'});
  collector_stream.write('<collector>\n');
  
  dictionary_array.forEach((item) => {
    if(mot_page.has(""+item)){
      collector_stream.write('\t<item>\n');
      collector_stream.write('\t\t<mot>'+item+"</mot>\n");
      collector_stream.write('\t\t<liens>\n');

      var tab = mot_page.get(""+item);
      tab.forEach((link) => {
        collector_stream.write('\t\t\t<titre>'+splitTolink(link)+"</titre>\n");
      });
      collector_stream.write('\t\t</liens>\n');
      collector_stream.write('\t</item>\n');
    }
  });
  collector_stream.write('</collector>');
  console.log("Collector generated succesfully");
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

function trueLink(title){
  var isReady = title.split("|");
  if(isReady.length == 1){
    return title;
  }else{
    return isReady[0];
  }
  console.log("something went wrong");
}


dictionary();
//-------------------------------------------------------------------//
//--------------------- END CODE DICTIONNAIRE -----------------------//
//-------------------------------------------------------------------//