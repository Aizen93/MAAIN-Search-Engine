// Dépendances requises
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');
//-------------------------------------------------------------------//
//-------------------------- CODE GRAPH -----------------------------//
//-------------------------------------------------------------------//

var argv = process.argv.slice(2);
if(argv.length != 1){
  console.log("Erreur d'arguments, voici un exemple :");
  console.log("- node graphgenerator.js public/data/corpus.xml");
  process.exit();
}
var corpus_url = argv[0];
var count = 0;

const cliProgress = require('cli-progress');
// create new progress bar
const b1 = new cliProgress.SingleBar({
  format: 'Graph en cours... |' + ('{bar}') + '| {percentage}% | {value}/{total} Pages totales | ETA: {eta}s',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});

/**
  entree : corpus_stream le chemin un writestream de corpus.xml
  sortie : true si la liste contient au moins un des mots de regex, false sinon
*/
function parser() {
  var fileStream = fs.createReadStream(corpus_url);
  var corpus_stream = fs.createWriteStream('./public/data/graph.xml', {flags:'a'});
  var streamer = new saxPath.SaXPath(saxParser, '//page');

  // initialize the loading bar
  b1.start(400000, 0);
  corpus_stream.write('<graph version="0.10" xml:lang="fr">\n\t');

  streamer.on('match', function(xml) {
    count++;
    corpus_stream.write("<page>\n\t");
    var string = xml
    var id = xml.split('<id>')[1].split('</id>')[0];
    var title = xml.split('<title>').pop().split('</title>')[0];
    corpus_stream.write("   <id>"+id+"</id>\n\t");
    corpus_stream.write("   <title>"+title+"</title>\n\t");
    corpus_stream.write("   <link>\n\t");

    var buffer1 = string.substr(0,30000);
    var buffer2 = "";
    string.replace(buffer1, "");
    sub1 = '[[';
    sub2 = ']]';
    while (string.length > 0 || !(buffer1.indexOf('[[') < 0 || buffer1.indexOf(']]') < 0)){
      if(!(buffer1.indexOf('[[') < 0 || buffer1.indexOf(']]') < 0)) {
        var SP = buffer1.indexOf(sub1)+sub1.length;
        var string1 = buffer1.substr(0,SP);
        var string2 = buffer1.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        var res = buffer1.substring(SP,TP);
        var tmp = res.split('|')[0];
        if(tmp.includes("[[")){
          var list = tmp.split(sub1);
          list.forEach((item, i) => {
            if(i > 0) corpus_stream.write("        <title>"+item.split('<')[0]+"</title>\n\t");
          });
        }else if(!tmp.includes('<','>')){
          corpus_stream.write("        <title>"+tmp+"</title>\n\t");
        }
        buffer1 = buffer1.substr(SP,buffer1.length);
      }else{
        buffer2 = string.substr(0,30000);
        string = string.replace(buffer2,"");
        buffer1.concat(buffer2);
      }
    }
    corpus_stream.write("   </link>\n\t");
    corpus_stream.write("</page>\n\t");
    b1.update(count);
    if(count == 400000){
      corpus_stream.write('\n</graph>');
      fileStream.close();
      b1.stop();
      console.log("Graph created successfully !!");
    };
  });
  fileStream.on('error', function(){
    console.log("Error parsing file !!!");
  });

  fileStream.on('end', function(){
    console.log("Graph created successfully !!!");
  });
  fileStream.pipe(saxParser);
}

/**
  fonction qui appelle le parser
*/
function graph(){
  parser();
}

graph();

//-------------------------------------------------------------------//
//------------------------ END CODE GRAPH ---------------------------//
//-------------------------------------------------------------------//
