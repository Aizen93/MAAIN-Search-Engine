
//-------------------------------------------------------------------//
//------------------------ CODE PAGERANK ----------------------------//
//-------------------------------------------------------------------//
/**
  Calcul le produitentre le vecteur et la matrice transposé (grâce au CLI)
*/
function produit_vecteur_matrice(c_array, l_array, i_array, v) {
  var n = l_array.length-1, dimV = v.length;
  var p = new Array();
  if (dimV!=n) {
      console.log("erreur dans les dimensions");
      return null;
  }
  for (var i = 0; i < dimV; i++) p[i] = 0;
  for (var i = 0; i < n; i++) {
    for (var j = l_array[i]; j < l_array[i+1]; j++) {
      if(i_array[j] != undefined)  p[i_array[j]]+=c_array[j]*v[i];
    }
  }
  return p;
}

/** 
 * Calcul la normalisation de P1 et P2
*/

function norm1(P1,P2){
  if(P1.length != P2.length)  console.log("dimensions error in function norm1")
  var n = P1.length;
  var res = 0;
  for (var i =0; i<n; i++)  res += Math.abs(P1[i]-P2[i]);
  return res;
}

/** 
 * Fonction nous permettant de realiser la formule de l'algorithme
*/
function mult_mat(dn, nd, P){
  for(var i = 0; i<P.length; i++)  P[i] = dn + nd * P[i];
  return P;
}

/** 
 * Implementantation de l'algorithme nous permettant de calculer le Pagerank-Zero grace a une precision epsilon 
*/
var pagerank_eps = function(mat_c, mat_l, mat_i, prob_Z, eps){
  var P1 = prob_Z;
  var diff = 0;
  var P2 = [];
  while(diff<eps){
    P2 = produit_vecteur_matrice(mat_c, mat_l, mat_i, P1);
    diff = norm1(P2,P1);
    P1=P2;
  }
  return P2;
}

/** 
 * Implementantation de l'algorithme nous permettant de calculer le Pagerank avec facteur zap 
*/
var pagerank_zap_steps = function(mat_c, mat_l, mat_i, prob_Z, d, nb_pas){
  var n = mat_l.length - 1;
  var P1 = prob_Z;
  var diff = Number.MAX_VALUE;
  var P2 = [];
  for(var i =0; i<nb_pas; i++){
    P2 = mult_mat(d/n, (1-d), produit_vecteur_matrice(mat_c, mat_l, mat_i, P1) );
    diff = norm1(P1,P2);
    P1=P2;
  }
  return P2;
}

/** 
 * Implementantation de l'algorithme nous permettant de calculer le Pagerank avec un facteur zap et une precision epsilon
*/
var pagerank_zap_eps = function(mat_c, mat_l, mat_i, prob_Z, d, eps){
  var n = mat_l.length - 1;
  var P1 = prob_Z;
  var diff = 0;
  var P2 = []
  while(diff<eps){
    var matrice = produit_vecteur_matrice(mat_c, mat_l, mat_i, P1);
    P2 = mult_mat(d/n, (1-d), matrice);
    diff = norm1(P1,P2);
    P1=P2;
  }
  return P2;
}
module.exports = {
  pagerank_eps, pagerank_zap_eps, pagerank_zap_steps
};

//-------------------------------------------------------------------//
//------------------------ END PAGERANK -----------------------------//
//-------------------------------------------------------------------//
