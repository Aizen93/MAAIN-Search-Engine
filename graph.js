// Dépendances requises
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');
//-------------------------------------------------------------------//
//-------------------------- CODE GRAPH -----------------------------//
//-------------------------------------------------------------------//
var fileStream = fs.createReadStream("./corpus.xml");
var corpus_stream = fs.createWriteStream('./graph.xml');
var string = "";
var count = 1;
function graph(){
  var start = new Date().getTime();
  var words_occurence = new  Map();
  var streamer = new saxPath.SaXPath(saxParser, '//page');
  var finish = false;

  var i = 0;
  corpus_stream.write('<graph version="0.10" xml:lang="fr">\n\t');

  streamer.on('match', function(xml) {
    console.log(count);
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
    while (string.length > 0){
      if(!(buffer1.indexOf('[[') < 0 || buffer1.indexOf(']]') < 0)) {
        var SP = buffer1.indexOf(sub1)+sub1.length;
        var string1 = buffer1.substr(0,SP);
        var string2 = buffer1.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        var res = buffer1.substring(SP,TP);
        var tmp = res.split('|')[0];
        //console.log(tmp);
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
    //console.log('titre : '+title+', id : '+id);
  });
  fileStream.on('error', function(){
    console.log("Error parsing file !!!");
  });

  fileStream.on('end', function(){
    fileStream.close();
    corpus_stream.write('\n</graph>');
    var end = new Date().getTime();
    var time = end - start;
    console.log(end - start);
    console.log("Graph created successfully !!!");
    corpus_stream.close();
  });
  fileStream.pipe(saxParser);

}
graph();

//-------------------------------------------------------------------//
//------------------------ END CODE GRAPH ---------------------------//
//-------------------------------------------------------------------//
