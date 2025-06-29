export class Tree {
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

  insert(value) {
    let insertionNode = this.#findInsertPoint(this.root, value);
    if (insertionNode.data === value) {
      return console.log("this number is already in the tree");
    }
    let newNode = new Node(value);
    if (value > insertionNode.data) {
      insertionNode.right = newNode;
    } else {
      insertionNode.left = newNode;
    }
  }

  delete(value) {
    let selectedNode = this.#findValue(this.root, value);
    let nextNode = null;
    let nextNextNode = null;

    //case 0: value is not in BST
    if (selectedNode === null) {
      return console.log(`Value: [${value}] is not in array`);
    }

    // case 1: leaf node (left and right are null) find the previous node and make it null
    else if (selectedNode.right === null && selectedNode.left === null) {
      nextNode = this.#findNodeParent(value);
      // left node filled, right node empty
      if (nextNode.right === null) {
        nextNode.left = null;
      } // right node filled, left node empty
      else if (nextNode.left === null) {
        nextNode.right = null;
      } else {
        if (nextNode.right.data === value) {
          nextNode.right = null;
        } else {
          nextNode.left = null;
        }
      }
    }

    // case 2: node with single child
    else if (this.#singleChildCheck(selectedNode)) {
      if (selectedNode.right === null) {
        nextNode = selectedNode.left;
        selectedNode.data = nextNode.data;
        selectedNode.left = null;
      } else {
        nextNode = selectedNode.right;
        selectedNode.data = nextNode.data;
        selectedNode.right = null;
      }
    }

    // case 3: both children
    else {
      nextNode = this.#findNext(selectedNode);
      nextNextNode = this.#findNextNext(nextNode);
      selectedNode.data = nextNode.data;
      if (nextNextNode.right === null) {
        nextNextNode.left = null;
      } else {
        nextNextNode.right = null;
      }
    }
  }

  find(value) {
    let currentNode = this.root;
    if (currentNode.data === value) {
      return currentNode;
    }
    // value is not inside BST
    if (
      currentNode.left === null &&
      currentNode.right === null &&
      currentNode.data != value
    ) {
      return null;
    } else {
      if (value > currentNode.data) {
        return this.#findValue(currentNode.right, value);
      }
      if (value <= currentNode.data) {
        return this.#findValue(currentNode.left, value);
      }
    }
  }

  height(value) {
    if (!this.find(value)) {
      return null;
    } else {
      let node = this.find(value);
      return this.#findHeight(node);
    }
  }
  #findHeight(node = this.root, height = 0, heights = []) {
    // Base case, no edges.
    if (node.left === null && node.right === null) {
      return 0;
    }
    // Adds an edge and recursively counts.
    height++;
    if (node.left !== null) {
      this.#findHeight(node.left, height, heights);
    }
    if (node.right !== null) {
      this.#findHeight(node.right, height, heights);
    }
    // Makes an array of all the heights, sorts and takes last value (max height of that node)

    heights.push(height);
    heights = arraySort(heights);

    return heights[heights.length - 1];
  }

  depth(value) {
    let depth = 0;
    if (!this.find(value)) {
      return null;
    } else {
      let node = this.find(value);
      while (node !== this.root) {
        depth++;
        node = this.#findNodeParent(node.data);
      }
      return depth;
    }
  }

  isBalanced() {
    let values = [];
    let depth = [];
    let height = [];
    let treeHeight = this.height(this.root.data);
    // This pushes each node data through depth and height class functions and creates an array of depths and heights of each value.
    function addToArray(node) {
      values.push(node.data);
    }
    this.levelOrder(addToArray);
    for (let i = 0; i < values.length; ++i) {
      depth.push(this.depth(values[i]));
      height.push(this.height(values[i]));
    }

    // This takes all nodes of same depth and makes an array with their associated height.
    // Sorts the array then checks first and last value of the array to see if | a - b | is > 1 if so, tree is unbalanced.
    for (let i = 0; i <= treeHeight; ++i) {
      let count = 0;
      let balanceCheck = [];
      // Counts how many data nodes are at the specific depth
      while (depth[0] === i) {
        count++;
        depth.shift();
      }
      // Creates the corresponding height array
      for (let j = 0; j < count; ++j) {
        balanceCheck.push(height[0]);
        height.shift();
      }
      // Sorts array
      balanceCheck = arraySort(balanceCheck);
      // Checks for balance
      if (balanceCheck[balanceCheck.length - 1] - balanceCheck[0] > 1) {
        return false;
      }
    }
    return true;
  }

  isBalancedTwo() {
    //Makes an array with levelOrder
    let array = [];
    function getNodes(node) {
      array.push(node);
    }
    this.levelOrder(getNodes);
    // Checks the height of left and right of each node and if there is a difference > 1 then balance is false.
    for (let i = 0; i < array.length; ++i) {
      if (array[i].right !== null && array[i].left !== null) {
        let left;
        let right;
        left = this.height(array[i].left.data);
        right = this.height(array[i].right.data);
        if (Math.abs(left - right) > 1) return false;
      }
      // The -1 is there because if one side is null and other side isn't, it will return heights =0 and =1 which won't trigger unbalance.
      if (array[i].right === null || array[i].left === null) {
        let left;
        let right;
        if (array[i].right) {
          right = this.height(array[i].right.data);
          left = -1;
        } else if (array[i].left) {
          left = this.height(array[i].left.data);
          right = -1;
        }
        if (Math.abs(left - right) > 1) return false;
      }
      // the case of both left and right being null is not important because it implies balance
    }
    return true;
  }

  rebalance() {
    let array = [];
    function getNodes(node) {
      array.push(node.data);
    }
    this.levelOrder(getNodes);
    array = arraySort(array);
    let rebalancedTree = new Tree(buildTree(array));
    this.root = rebalancedTree.root;
  }

  levelOrder(callbackFunc) {
    if (typeof callbackFunc != "function") {
      throw new Error("A function is required to use this command.");
    }
    let traverseOrder = [];
    let currNode = this.root;
    traverseOrder.push(currNode);
    while (traverseOrder.length !== 0) {
      callbackFunc(traverseOrder[0]);

      if (traverseOrder[0].left != null) {
        traverseOrder.push(traverseOrder[0].left);
      }
      if (traverseOrder[0].right != null) {
        traverseOrder.push(traverseOrder[0].right);
      }

      traverseOrder.shift();
    }
  }

  inOrder(callback, order = [], node = this.root) {
    if (typeof callback != "function") {
      throw new Error("A function is required to use this command.");
    }
    if (node === null) return;

    this.inOrder(callback, order, node.left);
    order.push(node);
    this.inOrder(callback, order, node.right);

    while (order[0] !== undefined) {
      callback(order[0]);
      order.shift();
    }
  }
  preOrder(callback, order = [], node = this.root) {
    if (typeof callback != "function") {
      throw new Error("A function is required to use this command.");
    }
    if (node === null) return;
    order.push(node);
    this.preOrder(callback, order, node.left);
    this.preOrder(callback, order, node.right);

    while (order[0] !== undefined) {
      callback(order[0]);
      order.shift();
    }
  }
  postOrder(callback, order = [], node = this.root) {
    if (typeof callback != "function") {
      throw new Error("A function is required to use this command.");
    }
    if (node === null) return;

    this.postOrder(callback, order, node.left);
    this.postOrder(callback, order, node.right);
    order.push(node);

    while (order[0] !== undefined) {
      callback(order[0]);
      order.shift();
    }
  }

  #findValue(node, value) {
    let currentNode = node;
    if (currentNode.data === value) {
      return currentNode;
    }
    // value is not inside BST
    if (
      currentNode.left === null &&
      currentNode.right === null &&
      currentNode.data != value
    ) {
      return null;
    } else {
      if (value > currentNode.data) {
        return this.#findValue(currentNode.right, value);
      }
      if (value <= currentNode.data) {
        return this.#findValue(currentNode.left, value);
      }
    }
  }
  #findNodeParent(value) {
    // going down the tree and searching for the input value, goes left if value is lower, right if value is higher, when it finds the value node, it then returns parent of value node
    let curr = this.root;
    if (curr.data === value) {
      return curr;
    }
    while (curr.right != null && curr.left != null) {
      if (curr.left.data === value || curr.right.data === value) {
        return curr;
      }
      if (value > curr.data) {
        curr = curr.right;
      } else curr = curr.left;
    }

    return curr;
  }
  #singleChildCheck(node) {
    if (node.left !== null || node.right !== null) {
      if (node.left !== null && node.right !== null) {
        return false;
      } else if (node.left !== null) {
        if (node.left.left === null && node.left.right === null) {
          return true;
        } else return false;
      } else {
        if (node.right.left === null && node.right.right === null) {
          return true;
        } else return false;
      }
    }
  }
  #findNext(node) {
    let curr = node.right;
    while (curr != null && curr.left != null) {
      curr = curr.left;
    }
    return curr;
  }
  #findNextNext(node) {
    let curr = this.root;
    let parent = null;

    while (curr.data !== node.data) {
      if (node.data > curr.data) {
        parent = curr;
        curr = curr.right;
      } else if (node.data <= curr.data) {
        parent = curr;
        curr = curr.left;
      }
    }
    return parent;
  }
  #findInsertPoint(node, value) {
    let currentNode = node;
    if (currentNode.data === value) {
      return currentNode;
    }
    if (currentNode.left === null && currentNode.right === null) {
      return currentNode;
    }
    if (currentNode.left === null && value <= currentNode.data) {
      return currentNode;
    }
    if (currentNode.right === null && value > currentNode.data) {
      return currentNode;
    } else {
      if (value > currentNode.data) {
        return this.#findInsertPoint(currentNode.right, value);
      }
      if (value <= currentNode.data) {
        return this.#findInsertPoint(currentNode.left, value);
      }
    }
  }
}

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export function arraySort(array) {
  return array.sort((a, b) => a - b);
}

export function removeDupes(array) {
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

export function buildTree(array) {
  if (array.length === 1) {
    return new Node(array[0]);
  } else if (array.length === 0) {
    return null;
  } else {
    let midPoint = Math.floor(array.length / 2);
    let base = new Node(array[midPoint]);
    let leftSide = array.slice(0, midPoint);
    let rightSide = array.slice(midPoint + 1);
    if (leftSide.length != 0) {
      base.left = buildTree(leftSide);
    }
    if (rightSide.length != 0) {
      base.right = buildTree(rightSide);
    }
    return base;
  }
}
