// Dépendances requises
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');

//-------------------------------------------------------------------//
//------------------ CORPUS GENERATION CODE -------------------------//
//-------------------------------------------------------------------//
var argv = process.argv.slice(2);
if(argv.length != 1){
  console.log("Erreur d'arguments, voici un exemple :");
  console.log("- node corpusgenerator.js public/data/frwiki.xml");
  process.exit();
}
var dataURL = argv[0];
var corpusURL = "./public/data/corpus.xml";
var NUMBER_OF_PAGE = 400000;
var count = 0;
var regexp = [/intelligence artificielle/i, /informati*/i, /nouvelle technologie/i, /robot/i];

/**
entree : une liste de mots
sortie : true si la liste contient au moins un des mots de regex, false sinon
*/
function filtrer(elmt) {
    var contains = false;
    regexp.forEach(
        function (exp) {
            if(elmt.match(exp)) {
                contains = true;
                return;
            }
        }
    );
    return contains;
};

/**
entree : bigfrwiki chemin vers frwiki.xml et corpusoutput chemin vers corpus.xml
sortie : ne retourne rien
Fonction qui permet la création du fichier contenant le corpus.
*/
function parseXML(bigfrwiki, corpusoutput) {
    var fileStream = fs.createReadStream(bigfrwiki);
    var corpus_stream = fs.createWriteStream(corpusoutput, {flags:'a'});
    var streamer = new saxPath.SaXPath(saxParser, '//page');
    var finish = false;

    corpus_stream.write('<corpus version="0.10" xml:lang="fr">');
    streamer.on('match', function(xml) {
        if(count < NUMBER_OF_PAGE){
            if(xml.length < 800000 && filtrer(xml)){
                corpus_stream.write("\n\t" + xml);
                count++;
            }
        }else{
            if(!finish){
                finish = true;
                fileStream.close();
                corpus_stream.write('\n</corpus>');
                console.log("Corpus created succefully !!");
                console.log("Total pages : " + count);
            }
        }
    });
    streamer.on('error', function(){
        console.log("Error parsing "+ bigfrwiki +" file !");
    });
    fileStream.on('error', function(){
        console.log("Error parsing "+ bigfrwiki +" file !!!");
    });
    fileStream.on('end', function(){
        corpus_stream.write('\n</corpus>');
        console.log("Corpus created succefully !!!");
        console.log("Total pages : " + count);
    });
    fileStream.pipe(saxParser);
}

parseXML(dataURL, corpusURL);

//-------------------------------------------------------------------//
//---------------- END OF CORPUS GENERATION CODE --------------------//
//-------------------------------------------------------------------//
