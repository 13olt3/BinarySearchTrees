class Tree {
  constructor(root) {
    this.root = root;
  }
  prettyPrint = (node = this.root, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };
}

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

function arraySort(array) {
  return array.sort((a, b) => a - b);
}

function removeDupes(array) {
  array = arraySort(array);
  let outputArray = [];
  for (let i = 0; i < array.length; ++i) {
    if (array[i] === array[i + 1]) {
      continue;
    } else {
      outputArray.push(array[i]);
    }
  }
  return outputArray;
}

function buildTree(array) {
  if (array.length === 1) {
    return new Node(array[0]);
  } else if (array.length === 0) {
    return null;
  } else {
    let midPoint = Math.floor(array.length / 2);
    let base = new Node(array[midPoint]);
    // console.log(array.length);
    let leftSide = array.slice(0, midPoint);
    let rightSide = array.slice(midPoint + 1);
    if (leftSide.length === 0) {
      base.left = null;
    } else {
      base.left = buildTree(leftSide);
    }
    if (rightSide.length === 0) {
      base.right = null;
    } else {
      base.right = buildTree(rightSide);
    }

    return base;
  }
}

let myArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

let sortedArray = removeDupes(arraySort(myArray));

let binaryTree = new Tree(buildTree(sortedArray));

binaryTree.prettyPrint();

// console.log("Base Array");
// console.log(sortedArray);
// console.log("Mid point");
// console.log(sortedArray[midPoint]);
// console.log("Left side");
// console.log(leftSide);
// console.log("right side");
// console.log(rightSide);
