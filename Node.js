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
var list = new Array();
list.push(10, "Algorithme");
list.push(21, "Autre titre...");

console.log("--------------------- list --------------------");
console.log(list);
console.log("-------------------- object -------------------");
console.log(list[1]);
if(list[1] == "Algorithme") console.log("id : "+list[1]);
var title;
list.forEach((item, i) => {
  if(item == 10) title = list[i+1];
});
console.log(title);
module.exports = Node
