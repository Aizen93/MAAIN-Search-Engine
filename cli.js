var matrice = new Array();
matrice[0] = new Array(0,3,5,8);
matrice[1] = new Array(1,0,2,0);
matrice[2] = new Array(0,0,0,0);
matrice[3] = new Array(0,3,0,0);
var l_array = new Array();
var c_array = new Array();
var i_array = new Array();

calcul_cli=function() {
  var count = 0;
  l_array.push(count);
  matrice.forEach((item, i) => {
    item.forEach((num, j) => {
      if(num > 0){
        c_array.push(num);
        i_array.push(j);
        count++;
      }
    });
    l_array.push(count);
  });
}

affichage_array=function() {
  console.log("Tableau L : ");
  console.log(l_array);
  console.log("Tableau C : ");
  console.log(c_array);
  console.log("Tableau I : ");
  console.log(i_array);
}

affichage=function() {
  matrice.forEach((item, i) => {
    item.forEach((num, j) => {
      console.log(num);
    });
  });
}

calcul_cli();
affichage_array();
