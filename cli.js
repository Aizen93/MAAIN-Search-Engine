var matrice = new Array();
matrice[0] = new Array(0,1/2,0,1/2);
matrice[1] = new Array(0,0,1,0);
matrice[2] = new Array(0,0,0,1);
matrice[3] = new Array(1/3,1/3,1/3,0);
var l_array = new Array();
var c_array = new Array();
var i_array = new Array();
v=[1,2,3,4];


function calcul_cli(graph_array) {
  var size = graph_array.length;
  l_array = [0];
  c_array = new Array();
  i_array = new Array();
  count = 0;
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if(graph_array[i][j] > 0){
        c_array.push(graph_array[i][j]);
        i_array.push(j);
        count++;
      }
    }
    l_array.push(count);
  }
}

function get_line_matrice(j) {
  var res = new Array();
  var list_indice = new Array();
  var n = 0, indice = 0, nb_elemt = l_array[j+1]-l_array[j];

  for (var i = 0; i < matrice.length; i++) res.push(0);
  if(nb_elemt == 0)   return res;

  while ((n != j) && (indice < i_array.length)) {
    if(i_array[indice] >= i_array[indice+1]) n++;
    indice ++;
  }
  while((i_array[indice] < i_array[indice+1]) && ((indice+1)<i_array.length)) {
    list_indice.push(i_array[indice++]);
  }
  if(indice == i_array.length) indice--;
  list_indice.push(i_array[indice]);
  indice = l_array[j];
  if(nb_elemt == 1) res[list_indice[0]] = c_array[indice];

  for (var i = 0; i < list_indice.length; i++) res[list_indice[i]] = c_array[indice++];

  return res;
}

function affichage_array() {
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
      p[i_array[j]]+=c_array[j]*v[i];
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

//New version
function empty_mat(n){
  var res = []
  for(var i = 0; i<n; i++){
    res[i] = 0;
  } 
  return res;
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
  var res = 0;
  for (var i =0; i<n; i++){
    res += Math.abs(P1[i]-P2[i]);
  }
  return res;
}

function mult_mat(dn, nd, P){
  for(var i = 0; i<P.length; i++){
    P[i] = dn + nd * P[i];
  }
  return P;
}

function pagerank_eps(mat_c, mat_l, mat_i, prob_Z, eps){
  var P1 = prob_Z;
  var cpt = 0;
  var diff = Number.MAX_VALUE;
  var P2 = [];
  while(diff>eps){
    P2 = produit_vecteur_matrice(P1);
    diff = norm1(P1,P2);
    //console.log("count: "+cpt+"\ndiff: "+diff+ "\neps: "+eps+ "\nP1: "+P1+"\nP2: "+P2+"\n");
    P1=P2;
    cpt++;
    if(cpt%10 == 0){
      console.log('boucle: '+cpt);
      var sum = P2.reduce(add, 0);
      console.log('somme =: '+sum);
      console.log('diff = '+diff);
    }
  }
  return P2;
}

function pagerank_zap_steps(mat_c, mat_l, mat_i, prob_Z, d, nb_pas){
  var n = mat_l.length - 1;
  var P1 = prob_Z;
  var cpt = 0;
  var diff = Number.MAX_VALUE;
  var P2 = [];
  for(var i =0; i<nb_pas; i++){
    P2 = mult_mat(d/n, (1-d), produit_vecteur_matrice(P1) );
    diff = norm1(P1,P2);
    //console.log("count: "+cpt+"\ndiff: "+diff+ "\nnb_pas: "+i+ "\nP1: "+P1+"\nP2: "+P2+"\n");

    P1=P2;
    cpt++;
    if(cpt%10 == 0){
      console.log('boucle: '+cpt);
      var sum = P2.reduce(add, 0);
      console.log('somme =: '+sum);
    }
  }
  return P2;
}

function pagerank_zap_eps(mat_c, mat_l, mat_i, prob_Z, d, eps){
  var n = mat_l.length - 1;
  var P1 = prob_Z;
  var cpt = 0;
  var diff = Number.MAX_VALUE;
  var P2 = []
  while(diff>eps){
    P2 = mult_mat(d/n, (1-d), produit_vecteur_matrice(P1));
    diff = norm1(P1,P2);
    //console.log("count: "+cpt+"\ndiff: "+diff+ "\neps: "+eps+ "\nP1: "+P1+"\nP2: "+P2+"\n");

    P1=P2;
    cpt++;
    if(cpt%10 == 0){
      console.log('boucle: '+cpt);
      var sum = P2.reduce(add, 0);
      console.log('somme =: '+sum);
      console.log('diff = '+diff);
    }
  }
  return P2;
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


calcul_cli(matrice);
affichage_array();
console.log("-------------------");
//var tp = produit_vecteur_matrice(v);
var tp = pagerank_eps(c_array, l_array, i_array, [1,1,1,1], 0.0001);
var tp2 = pagerank_zap_steps(c_array, l_array, i_array, [1,1,1,1], 0.0001, 1000);
var tp3 = pagerank_zap_eps(c_array, l_array, i_array, [1,1,1,1], 0.2, 0.0001);
console.log("-----test agerank epsilon-----");
console.log(tp);
console.log("-----test pagerank zap steps-----");
console.log(tp2);
console.log("-----test pagerank zap epsilon-----");
console.log(tp3);
