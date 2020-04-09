// Dépendances requises
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');

//-------------------------------------------------------------------//
//-------------------------- CODE GRAPH -----------------------------//
//-------------------------------------------------------------------//

function graph(){
  var fileStream = fs.createReadStream("./corpus.xml");
  var corpus_stream = fs.createWriteStream('./graph.xml', {flags:'a'});
  var words_occurence = new  Map();
  var streamer = new saxPath.SaXPath(saxParser, '//page');
  var finish = false;

  corpus_stream.write('<graph version="0.10" xml:lang="fr">\n\t');

  streamer.on('match', function(xml) {
    var str = xml
    var id = getFromBetween.get(str,"<id>","</id");
    var title = str.split('<title>').pop().split('</title>')[0];
    var text = str.split('<text xml:space="preserve">').pop().split('</text>')[0];

    corpus_stream.write("<id>"+id[0]+"</id>\n\t");
    corpus_stream.write("<title>"+title+"</title>\n\t");

    var tmp = getFromBetween.get(text,"[[","]]");
    console.log('taille tmp : '+tmp.length);
    tmp.forEach((item) => {
      var word = item.split(':')[0];
      corpus_stream.write("     <title>"+word.split('|')[0]+"</title>\n\t");
    });
    corpus_stream.write("</link>\n\t");
    console.log('titre : '+title+', id : '+id[0]);
  });
  fileStream.on('error', function(){
    console.log("Error parsing file !!!");

  });
  fileStream.on('end', function(){
    console.log("Graph created succefully !!!");
    console.log(dictionary);
  });
  fileStream.pipe(saxParser);
}

graph();

var getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        var result = this.getFromBetween(sub1,sub2);
        this.results.push(result);
        this.removeFromBetween(sub1,sub2);
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1)  this.getAllResults(sub1,sub2);
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};

//-------------------------------------------------------------------//
//------------------------ END CODE GRAPH ---------------------------//
//-------------------------------------------------------------------//
