// Dépendances requises
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');

//-------------------------------------------------------------------//
//-------------------------- CODE GRAPH -----------------------------//
//-------------------------------------------------------------------//
var fileStream = fs.createReadStream("./corpus.xml");
var corpus_stream = fs.createWriteStream('./graph.xml', {flags:'a'});

function graph(){
  var start = new Date().getTime();
  var words_occurence = new  Map();
  var streamer = new saxPath.SaXPath(saxParser, '//page');
  var finish = false;

  corpus_stream.write('<graph version="0.10" xml:lang="fr">\n\t');

  streamer.on('match', function(xml) {
    var str = xml
    var id = getFromBetween.get(str,"<id>","</id");
    //var id = str.split('<id>').pop().split('</id>')[0];
    var title = str.split('<title>').pop().split('</title>')[0];
    var text = str.split('<text xml:space="preserve">').pop().split('</text>')[0];

    corpus_stream.write("<id>"+id[0]+"</id>\n\t");
    corpus_stream.write("<title>"+title+"</title>\n\t");
    var liens = [];
    liens = str.split('[[').pop().split(']]');
    //getFromBetween.get(text,"[[","]]");

    //console.log('taille tmp : '+tmp.length);
    liens.forEach((item) => {
      //var word = item.split(':')[0];
      if(!item.match('Categorie')) corpus_stream.write("     <title>"+item.split('|')[0]+"</title>\n\t");
    });
    corpus_stream.write("</link>\n\t");
    console.log('titre : '+title+', id : '+id[0]);
  });
  fileStream.on('error', function(){
    console.log("Error parsing file !!!");

  });
  fileStream.on('end', function(){
    var end = new Date().getTime();
    var time = end - start;
    console.log(end - start);
    console.log("Graph created succefully !!!");
  });
  fileStream.pipe(saxParser);

}

graph();

var getFromBetween = {
  results:[],
  string:"",
  count:0,
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
    //console.log(id);
    if(sub1 === '<id>' && this.count == 0){
      var id = this.getFromBetween(sub1,sub2);
      this.count++;
      this.results.push(id);
      return;
    }
    this.removeFromBetween(sub1,sub2);
    if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1)  this.getAllResults(sub1,sub2);
    else return;
  },
  get:function (string,sub1,sub2) {
    this.results = [];
    this.count = 0;
    this.string = string;
    this.getAllResults(sub1,sub2);
    return this.results;
  }
};

//-------------------------------------------------------------------//
//------------------------ END CODE GRAPH ---------------------------//
//-------------------------------------------------------------------//
