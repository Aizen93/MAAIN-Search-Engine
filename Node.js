class Node {
  constructor(n, str) {
    this.id = n;
    this.title = str;
    this.links = [];
  }

  get id_node(){
    return this.id;
  }
  get title_node(){
    return this.title;
  }
  get links_node(){
    return this.links;
  }

  add_link(str) {
    this.links.push(str);
  }
}
module.exports = Node
