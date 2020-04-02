// Dépendances requises
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');
var serv = express();
serv.use(bodyParser.urlencoded({ extended: true }));
serv.set('view engine', 'ejs');

// Démarrage du serveur
/*serv.use(express.static(__dirname + '/public'));
serv.listen(8080, function() {
    console.log("Server started");
});*/

//-------------------------------------------------------------------//
//------------------ CORPUS GENERATION CODE -------------------------//
//-------------------------------------------------------------------//

var dataURL = './frwiki-20190120-pages-articles.xml';
//var dataURL = './public/data/frwiki-debut.xml';
var corpusURL = "./corpus.xml";
var NUMBER_OF_PAGE = 600000;
var count = 0;
var regexp = [/intelligence artificielle/i, /informati*/i, /nouvelle technologie/i, /robot/i];

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

function parseXML(bigfrwiki, corpusoutput) {
    var fileStream = fs.createReadStream(bigfrwiki);
    var corpus_stream = fs.createWriteStream(corpusoutput, {flags:'a'});
    var streamer = new saxPath.SaXPath(saxParser, '//page');
    var finish = false;
    
    corpus_stream.write('<corpus version="0.10" xml:lang="fr">');
    streamer.on('match', function(xml) {
        if(count < NUMBER_OF_PAGE){
            if(filtrer(xml)){
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

serv.get("/", function (req, res) {
    res.render("pages/index.ejs");
});

serv.post("/", function (req, res) {
    var search = String(req.body.search);
    console.log(search);
    res.render("pages/index", {data: req.body});
});