parse_file = function(fileText){
    console.log("dans le parser");
    var parse = new DOMParser();
    return parse.parseFromString(fileText, "text/xml");
};

function compare( elmt_a, elmt_b ) {
    if ( elmt_a < elmt_b ){
        return -1;
    }
    if ( elmt_a > elmt_b ){
        return 1;
    }
    return 0;
}

send = function(error) {
    console.log(error);
};

var list = function(list) {
    document.getElementById('nb_titre').innerText = 'Il y a '+list.length+' r\u00e9sultat(s) trouv\u00e9s'
    list.forEach(function (elmt) {
        document.getElementById('titles').innerHTML += '<li>'+ elmt +'</li>';
    }
    );

}

document.getElementById("upload").onclick = function(){
    var t0 = performance.now();

    var file = document.getElementById('load').files[0];
    var reader = new FileReader();
    console.log("reader");
    //var mots_communs = /intelligence artificielle/i;
    reader.onerror = function (event){
        send("Error : File not found");
    };
    reader.onload = function(){
        var fileText = reader.result;
        tree = parse_file(fileText);
        let tab = tree.getElementsByTagName("page");
        console.log(tab);
        console.log("page : " + tab.length);
        tmp = Array.from(tab);
        const filtre = tmp.filter(element =>  filtrer(element.innerHTML));
        var titles = new Array();
        filtre.forEach(elmt => {
            titles.push(elmt.getElementsByTagName('title').item(0).innerHTML);
        })
        list(titles.sort(compare));
    };
    reader.readAsText(file);
    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
};

filtrer = function(elmt) {
    var regexp = [/intelligence artificielle/i, /informati*/i, /nouvelle technologie/i, /robot/i];
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


//var dictionnaire = [/homme/, /tout/, /être/, /deux/, /mari/, /grand/, /avoir/, /cent/, /que/, /pas/, /femme/,
//    /petit/, /faire/, /mille/, /comme/, /plus/, /jour/, /même/, /dire/, /trois/, /mais/, /bien/, /dans/, /qui/,
//    /mer/, /autre/, /pouvoir/, /quatre/, /ou/, /si/, /pour/, /temps/, /seul/, /aller/, /vingt/, /quand/, /main/,
//    /jeune/, /voir/, /cinq/, /chose/, /premier/, /vouloir/, /dix/, /puis/, /tout/, /avec/, /vie/, /bon/, /venir/]
    //neuf encore yeux quel devoir six  aussi sous  votre heure beau prendre huit ni peu après quelque monde vieux
    // trouver sept parce que alors entre enfant noir donner trente pourquoi toujours vers tout fois nouveau
    // falloir quarante lorsque jamais chez y chaque moment dernier parler cinquante tandis que non jusque en
    // aucun tête blanc mettre quinze puisque très contre où tel père cher savoir douze comment ainsi devant tu
    // certain fille long passer un soit moins depuis moi plusieurs coeur pauvre regarder or ici pendant te
    // d'autres an plein aimer oui avant celui nul terre vrai croire trop voilà rien dieu toute demander déjà
    // près dont monsieur bas rester tant dès tout voix gros répondre enfin malgré ça maison doux entendre
    // maintenant voici cela coup heureux penser beaucoup selon autre air haut arriver assez derrière un mot
    // profond connaître loin parmi toi nuit rouge devenir point afin de lequel eau humain sentir presque auprès
    // leur ami général sembler ailleurs quant à quoi porte français tenir seulement hors personne amour froid
    // comprendre aujourd'hui durant l'un pied sombre rendre mieux grâce chacun gens sûr attendre autour plein
    // auquel nom ancien ,/sortir/ ,/souvent/, /quelqu'un/]

