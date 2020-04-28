var matrice = new Array();
matrice[0] = new Array(0,3,5,8);
matrice[1] = new Array(1,0,2,0);
matrice[2] = new Array(0,0,0,0);
matrice[3] = new Array(0,3,0,0);
var l_array = new Array();
var c_array = new Array();
var i_array = new Array();

calcul_cli=function(matrice) {
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

affichage=function(matrice) {
  matrice.forEach((item, i) => {
    var s = '';
    item.forEach((num, j) => {
      s += num+' ';
      //console.log(num);
    });
    console.log(s);
  });
}
function transpose_matrice(matrice){
  var result = new Array();
  for(var i = 0; i<matrice.length; i++){
    result[i] = new Array();
    for(var j=0; j<matrice[i].length; j++){
      result[i][j] = matrice[j][i];
    }
  }
  return result;

}

var matriceT = new Array();
matriceT[0] = new Array(14,9,30,5);
matriceT[1] = new Array(6,10,4,-2);
matriceT[2] = new Array(6,6,-9,1);
matriceT[3] = new Array(3,9,-7,0);

affichage(transpose_matrice(matriceT));

calcul_cli(matriceT);
affichage_array();
