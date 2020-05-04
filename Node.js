class Node {
  /**
    Constructeur qui créer un Node
  */
  constructor(n, str) {
    this.id = n;
    this.title = str;
    this.links = [];
  }
  /*------Getter----------*/
  get id_node(){
    return this.id;
  }
  get title_node(){
    return this.title;
  }
  get links_node(){
    return this.links;
  }
  /*---------------------*/
  /**
    ajoute un nouveau lien au Node
  */
  add_link(str) {
    this.links.push(str);
  }
}
module.exports = Node
