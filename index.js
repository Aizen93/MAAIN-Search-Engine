// Dépendances requises
var express = require('express');
var bodyParser = require('body-parser');
var serv = express();
serv.use(bodyParser.urlencoded({ extended: true }));
serv.set('view engine', 'ejs');
var fs = require('fs');
var saxParser = require('sax').createStream(true);
var saxPath = require('saxpath');
var removePunctuation = require('remove-punctuation');
// Démarrage du serveur
serv.use(express.static(__dirname + '/public'));
serv.listen(8080, function() {
  console.log("Server started");
});

serv.get("/", function (req, res) {
  res.render("pages/index.ejs");
    dictionary();
});

serv.post("/", function (req, res) {
  var search = String(req.body.search);
  console.log(upper_noaccent(search));
  res.render("pages/index", {data: req.body});
});
