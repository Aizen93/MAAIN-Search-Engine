// Dépendances requises
var express = require('express');
var bodyParser = require('body-parser');
var serv = express();
serv.use(bodyParser.urlencoded({ extended: true }));
serv.set('view engine', 'ejs');

// Démarrage du serveur
serv.use(express.static(__dirname + '/public'));
serv.listen(8080, function() {
    console.log("Server started");
});

var x = 0;

serv.get("/", function (req, res) {
    res.render("pages/index.ejs");
});


serv.post("/", function (req, res) {
    var search = String(req.body.search);
    console.log(search);
    res.render("pages/index", {data: req.body});
});