// Dépendances requises
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var serv = express();
serv.use(bodyParser.urlencoded({ extended: true }));
serv.set('view engine', 'ejs');

// Démarrage du serveur
serv.use(express.static(__dirname + '/public'));
serv.listen(8080, function() {
    console.log("Server started");
});

//-------------------------------------------------------------------//
//-------------------------------------------------------------------//
//-------------------------------------------------------------------//

function printData(data) {
    // Data will be null when it reaches the end.
    if (!data) return;
    
    // type of data = Buffer
    var stringData = data.toString('utf8', 0, data.length);
    console.log(stringData.length);
    //console.log(stringData);
  }

function readFileStream(fileName, cb, options) {
    return new Promise(function(resolve, reject) {
        var readable = fs.createReadStream(fileName, options);

        readable.on('data', function(data) {
            cb(data);
        })

        readable.on('end', function() {
            resolve();
        })

        readable.on('error', function(err) {
            return reject(err);
        })
    })
}

readFileStream('./test.txt', printData, {highWaterMark: 512 * 1024}).then(function() {
    console.log("\nDone reading");
  }).catch(function(err) {
    console.log(err);
  })

//-------------------------------------------------------------------//
//-------------------------------------------------------------------//
//-------------------------------------------------------------------//

serv.get("/", function (req, res) {
    res.render("pages/index.ejs");
});

serv.post("/", function (req, res) {
    var search = String(req.body.search);
    console.log(search);
    res.render("pages/index", {data: req.body});
});