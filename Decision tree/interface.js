start_button.addEventListener('click', start);
reset_button.addEventListener('click', reset);
getFile_button.addEventListener('click', createTree);

// Get the file input element
const FILE = document.getElementById('file_input');

// Initialize a flag variable
let flag = true;

// Set the initial value of the input_data element
document.getElementById('input_data').value = "rainy,cool,normal,true";

// Build the initial tree with data of depth 3
buildTree(getData(3));

// Get the tree root element
let treeRoot = document.getElementById("root");

// Function to create a tree based on the input file
function createTree() {
  // Remove the existing tree
  treeRoot = removeTree();

  // Check if a file is selected
  if (FILE.value === '') {
    // If no file is selected, build the tree with default data
    buildTree(getData(3));
    drawTree(root, treeRoot);
  } else {
    // If a file is selected, read its contents
    let data = FILE.files[0];
    let reader = new FileReader();
    reader.readAsText(data);
    console.log(data);
    reader.onload = function () {
      // Parse the CSV data into a matrix
      data = parseCSVtoMatrix(reader.result);
      // Build the tree with the parsed data
      buildTree(data);
      drawTree(root, treeRoot);
    }
  }
  flag = true;
}

// Function to start the bypassing of the tree
function start() {
  if (flag) {
    bypassTree();
    flag = false;
  }
}

// Function to reset the tree
function reset() {
  treeRoot = removeTree(treeRoot);
  //drawTree(root, treeRoot);
}

// Function to draw the tree recursively
function drawTree(currentNode, treeElement) {
  let li = document.createElement("li");
  let a = document.createElement("a");
  currentNode.a = a;
  a.href = "#";
  let nodeName = currentNode.nodeName;
  let atr = currentNode.atribute
  if (nodeName === "root") {
    a.textContent = nodeName;
  } else {
    a.textContent = atr + " = " + nodeName;
  }
  
  li.appendChild(a);
  treeElement.appendChild(li);
  
  // Check if the current node is a leaf
  if (currentNode.isLeaf()) {
    return;
  }
  
  let ul = document.createElement("ul");
  li.appendChild(ul);
  
  // Recursively draw the branches of the current node
  for (let i = 0; i < currentNode.branches.length; i++) {
    drawTree(currentNode.branches[i], ul);
  }
}

// Function to remove the existing tree
function removeTree() {
  let divTree = document.getElementById("tree");
  treeRoot.remove();
  let ul = document.createElement("ul");
  divTree.appendChild(ul);
  return ul;
}

// Initial drawing of the tree
drawTree(root, treeRoot);
