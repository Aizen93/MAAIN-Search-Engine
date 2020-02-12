// Dépendances requises
var express = require('express');
var serv = express();
serv.set('view engine', 'ejs');

// Démarrage du serveur
serv.use(express.static(__dirname + '/public'));
serv.listen(8080, function() {
    console.log("Server started");
});

serv.get("/", function (req, res) {
    res.render("pages/index.ejs");
});