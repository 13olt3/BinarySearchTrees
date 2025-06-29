import { Tree, buildTree, arraySort, removeDupes } from "./binarySearchTree.js";

function buildArray() {
  let array = [];
  for (let i = 0; i < 20; ++i) {
    array.push(getRandomInt(100));
  }
  return array;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function printNodes(node) {
  console.log(node.data);
}

let array = buildArray();
array = removeDupes(arraySort(array));
let binaryTree = new Tree(buildTree(array));

binaryTree.prettyPrint();
console.log("Preorder");
binaryTree.preOrder(printNodes);
console.log("Inorder");
binaryTree.inOrder(printNodes);
console.log("Postorder");
binaryTree.postOrder(printNodes);

binaryTree.insert(105);
binaryTree.insert(120);
binaryTree.insert(135);
binaryTree.insert(200);
binaryTree.insert(214);

binaryTree.rebalance();
binaryTree.prettyPrint();
console.log("Preorder");
binaryTree.preOrder(printNodes);
console.log("Inorder");
binaryTree.inOrder(printNodes);
console.log("Postorder");
binaryTree.postOrder(printNodes);
