var matrice = new Array();
matrice[0] = new Array(0,3,5,8);
matrice[1] = new Array(1,0,2,0);
matrice[2] = new Array(0,0,0,0);
matrice[3] = new Array(0,3,0,0);
var l_array = new Array();
var c_array = new Array();
var i_array = new Array();
v=[1,2,3,4];

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

function produit_vecteur_matrice(v) {
  var n = l_array.length-1, dimV = v.length;
  if (dimV!=n) {
      console.log("erreur dans les dimensions");
      return null;
  }
  var p = new Array();
  for (var i = 0; i < n; i++) p[i] = 0;
  for (var i = 0; i < n; i++) {
    for (var j = l_array[i]; j < l_array[i+1]; j++) {
      p[i]+=c_array[j]*v[i_array[j]];
    }
  }
  return p;
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

function pagerank_steps(matrice, sommet, nb_pas){
  var vec_P = [];
  cpt =0;
  for (var x in M) {
    if (x == sommet) {
      vec_P[cpt] = 1;
    }else{
      vec_P[cpt] = 0;
    }
    cpt++;
  }

  for(var i= 0; i<nb_pas; i++){
    vec_P = transpose_matrice(P);
    console.log('Probabilité = '+vec_P.toString());
  }
}

//New version
function empty_mat(n){
  var res = []
  for(var i = 0; i<n; i++){
    res[i] = 0;
  } 
  return res;
}

function produitVTlignes0(mat_c,mat_l,mat_i,v){
  var n = mat_l.length-1;
  var m = mat_c.length;
  var dimV = v.length;
  if(dimV != n){
    console.log('dimensions error');
    return null;
  }
  var p = empty_mat(n);
  var nbaleas = n/300;
  if(nbaleas == 0){
    nbaleas=1;
  }
  var delta = 1/nbaleas;
  for(var i = 0; i<n; i++){
    if(mat_l[i] == mat_l[i+1]){
      var aleas_tab = get_sample(n, nbaleas);
      var aleas = aleas_tab[Math.floor(Math.random() * Math.floor(aleas_tab.length))];
      for(var j=0; j<aleas; j++){
        p[j]+=delta * V[i];
      }
    }else{
      for(var k = mat_l[i]; k<mat_l[i+1]; k++){
        p[mat_i[c]]+=mat_c[c] * v[i];
      }
    }
  }
  return p;
}

function is_visited(nb, tab){
  for(var i = 0; i<tab.length; i++){
    if(tab[i] == nb){
      return true;
    }
  }
  return false;
}
function get_sample(nb, tab){
  var res = [];
  var visited_elements = []
  for(var i =0; i<nb; i++){
    var visited = true;
    while(visited == true){
      var rand = Math.floor(Math.random() * Math.floor(nb));
      if(!is_visited(rand, visited_elements)){
        visited = false;
      }
    }
    res[res.length+1]=rand
  }
  return res;
}

function add(a, i){
  return a+i;
}


function norm1(P1,P2){
  if(P1.length != P2.length){
    console.log("dimensions error in function norm1")
  }
  var n = P1.length;
  var res = [];
  for (var i =0; i<n; i++){
    res = Math.abs(P1[i]-P2[i]);
  }
  return res;
}


function pagerank_steps_bis(mat_c, mat_l, mat_i, prob_Z, d, nb_pas){
  var cv = [];
  var n = L.length - 1;
  var P1 = prob_Z;
  var cpt = 0;
  for(var i =0; i<nb_pas; i++){
    var P2 = d/n +(1-d)* produitVTlignes0(mat_c, mat_l, mat_i, P1);
    var diff = norm1(P1,P2);
    cv.append(diff);
    cpt++;
    if(cpt%10 == 0){
      console.log('boucle: '+cpt);
      var sum = P2.reduce(add, 0);
      console.log('somme =: '+sum);
    }
  }
  return P2;
}





function dist_manhattan(x, y){
  for ( var i = 0; i < x.length; i++ ) {
    x[i] = Math.round( Math.random()*10 );
    y[i] = Math.round( Math.random()*10 );
  }
}

function vecteur_transpose(v) {
  var n = l_array.length-1, m = c_array.length, dimV = v.length;
  if (dimV!=n){
      console.log("erreur dans les dimensions");
      return null;
  }
  var p = new Array();
  for (var i = 0; i < n; i++) p[i] = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < array.length; j++)  p[i_array[j]]+=c_array[j]*v[i];
  }
  return p;
}

function vecteur_transpose_ligne_null(v){
  var n = l_array.length-1, m = c_array.length, dimV = v.length;

  if (dimV!=n) {
      console.log("erreur dans les dimensions");
      return null;
  }
  var p = new Array();
  for (var i = 0; i < n; i++){
     p[i] = 0;
  }
  var nbaleas=n/300
  if (nbaleas==0){
      nbaleas=1
  }
  var delta=1/nbaleas
  for (i in range(n)){
      if (L[i]==L[i+1]){
          aleas=random.sample(range(0, n), nbaleas)
          for (j in aleas){
              P[j]+=delta*V[i]
          }
      }
      else{
          for (c in range(L[i],L[i+1])){
              P[I[c]]+=C[c]*V[i]
          }
      }
  }
  return P
}

function pagerangzero(V){

/*  var vec_P = [];
  cpt =0;
  for (var i = 0; i < matrice.length; i++) {
    var ligne = matrice[i];
    for (var j = 0; j < ligne.length; j++) {
      if (ligne[j] == 0) {
        vec_P[cpt] = 1;
      }else{
        vec_P[cpt] = 0;
      }
      cpt++;
    }
  }
  for (var x in M) {
    if (x == 0) {
      vec_P[cpt] = 1;
    }else{
      vec_P[cpt] = 0;
    }
    cpt++;
  }

  var d = eps;
  while(d>=eps){
    vec_Pk = transpose_matrice(vec_P);
    d= dist_manhattan(vec_P, vec_Pk);
    vec_P = vec_Pk;
  }
  return vec_P;*/
}

var matriceT = new Array();
matriceT[0] = new Array(14,9,30,5);
matriceT[1] = new Array(6,10,4,-2);
matriceT[2] = new Array(6,6,-9,1);
matriceT[3] = new Array(3,9,-7,0);

affichage(transpose_matrice(matriceT));

calcul_cli(matriceT);
affichage_array();
console.log("-------------------");
var tp = produit_vecteur_matrice(v);
console.log(tp);
