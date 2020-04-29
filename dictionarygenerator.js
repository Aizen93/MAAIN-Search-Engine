// Dépendances requises
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');
var natural = require('natural');
var accents = require('remove-accents');


var count = 0;
var dictionary_array = new Array();
var mot_page = new Map();
var words_occurence = new  Map();
var NBRPAGES = 450000;


//-------------------------------------------------------------------//
//---------------------- CODE DICTIONNAIRE --------------------------//
//-------------------------------------------------------------------//

function dictionary(){
  var fileStream = fs.createReadStream("./corpus.xml");
  var streamer = new saxPath.SaXPath(saxParser, '//page');
  var tokenizer = new natural.AggressiveTokenizerFr();
  var finish = false;

  streamer.on('match', function(xml) {
    if(count < NBRPAGES){
        let indexOfFirst = xml.indexOf('<title>')+7;
        let indexOfLast = xml.indexOf('</title>') - indexOfFirst;
        let title = xml.substr(indexOfFirst, indexOfLast);

        console.log("page :"+count+" titre : "+title+"\n______________________________________\n");
        console.log(mot_page.size);
        
        indexOfFirst = xml.indexOf('<text xml:space="preserve">')+27;
        indexOfLast = xml.indexOf('</text>') - indexOfFirst;
        xml = xml.substr(indexOfFirst, indexOfLast);
        let tab = tokenizer.tokenize(xml);
        
        tab.forEach((word, i) => {
          if(word.length > 3 && word.length < 15 && word != "apos"){
            let item = lower_noaccent(word);
          
            const regex = /[&,/<>{}=@0-9*+()-_|\n]/g;
            const found = item.match(regex);
            if(found == null){
              if(mot_page.get(item) != null){
                words_occurence.set(item, words_occurence.get(item) + 1);
                let tmp = mot_page.get(item);
                if(!tmp.includes(title) && tmp.length < 3000){
                  tmp.push(title);
                  mot_page.set(item, tmp);
                }
              } else{
                if(mot_page.size < 1100000){
                  words_occurence.set(item, 1);
                  let title_liste = new Array();
                  title_liste.push(title);
                  mot_page.set(item, title_liste);
                }
              }
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
          let word = iterator.next().value;
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

function lower_noaccent(word) {
  return accents.remove(word.toString().toLocaleLowerCase());
}

//-------------------------------------------------------------------//
//--------------------- END CODE DICTIONNAIRE -----------------------//
//-------------------------------------------------------------------//


//-------------------------------------------------------------------//
//------------------------- CODE COLLECTOR --------------------------//
//-------------------------------------------------------------------//
/**
 * On utilise le dictionnaire pour créer le collector (relation mot-page) 
 * on ne prend que les 10k mot les plus fréquents dans le corpus
 */
function generateCollector(){
  console.log("generating collector ....");
  var collector_stream = fs.createWriteStream("./collector.xml", {flags:'a'});
  collector_stream.write('<collector version="0.10" xml:lang="fr">\n');
  
  dictionary_array.forEach((item) => {
    if(mot_page.get(item) != null){
      collector_stream.write(
        '\t<item>\n'+
        '\t\t<mot occ="'+words_occurence.get(item)+'">'+item+'</mot>\n'+
        '\t\t<liens>\n'
      );

      var tab = mot_page.get(""+item);
      tab.forEach((link) => {
        collector_stream.write('\t\t\t<titre>'+link+"</titre>\n");
      });
      collector_stream.write(
        '\t\t</liens>\n'+
        '\t</item>\n'
      );
    }
  });
  collector_stream.write('</collector>');
  console.log("Collector generated succesfully");
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

//-------------------------------------------------------------------//
//----------------------- END CODE COLLECTOR ------------------------//
//-------------------------------------------------------------------//

dictionary();