

class Node {
    constructor(nodeName, atribute, atributeNumber) {
        this.nodeName = nodeName;
        this.data = [];
        this.branches = [];
        this.atribute = atribute;
        this.atributeNumber = atributeNumber;
        this.a;
        this.wasPainted = false;
    }

    isLeaf() {
        if (this.branches == undefined) {
            return true;
        }
        else if (this.branches.length == 0) {
            return true;
        }

        return false;
    }
}

let root;
let uniqueResults = [];

async function bypassTree() {
    let str = document.getElementById('input_data').value;
    array = parseCSVtoArray(str);
    let currentNode = root;
    let counter = root.data[0].length;
    while(true) {
        if(!currentNode.wasAdded){
            currentNode.wasAdded = true;
            await gradient('rgb(255, 255, 255)', 'rgb(36, 122, 191)', currentNode);
            await sleep(100);
        }
        for(let j = 0; j<currentNode.branches.length; j++) {
            if((currentNode.branches[j].nodeName === array[currentNode.branches[j].atributeNumber])||
               (currentNode.branches[j].atributeNumber === root.data[0].length-1)) {
                currentNode = currentNode.branches[j];
                break;
            }
        } 
        if((currentNode.atribute === root.data[0][root.data[0].length-1])&&(!currentNode.wasPainted)) {
            currentNode.wasPainted = true;
            await gradient('rgb(255, 255, 255)', 'rgb(36, 122, 191)', currentNode);
            break;
        }
        counter--;
        if(counter<0) {
            alert("I can't handle your test.")
            break;
        }
    }
}

async function gradient(start_RGB, finish_RGB, node) {
    let rgb = getRGB(start_RGB);
    start_RGB = getRGB(start_RGB);
    finish_RGB = getRGB(finish_RGB);
    for(let i = 0; i<150; i++) {
        for(let j = 0; j<3; j++) {
            rgb[j] -= (start_RGB[j] - finish_RGB[j])/150;
        }
        node.a.style.backgroundColor = 'rgb('+ rgb[0] +','+ rgb[1] +','+ rgb[2] +')';
        await sleep(1);
    }
} 

function getRGB(str){
    let regex = /\d{1,3}/;
    let rgb = [];
    for(let i = 0; i<3; i++) {
        rgb[i] = parseFloat(regex.exec(str));
        str = str.replace(regex, "")
    }
    return rgb
}

function sleep(ms) { 
   return new Promise(resolve => setTimeout(resolve, ms));
} 



function buildTree(data) {
    root = new Node("root");
    root.data = data;
    for(let i = 1; i<root.data.length; i++) {
        uniqueResults[i - 1] = root.data[i][root.data[i].length-1];
    }
    uniqueResults = getUniqueAtributes(uniqueResults);
    growBranch(root);
}

function growBranch(currentNode) { 
    currentNode.branches = getArrayOfBranches(currentNode.data);
    for(let i = 0; i<currentNode.branches.length; i++) {
        let nextNode = currentNode.branches[i];
        for(let j = 0; j < currentNode.data.length; j++) {
            if((j === 0) || (currentNode.data[j][currentNode.branches[i].atributeNumber] === currentNode.branches[i].nodeName)) {
                nextNode.data[nextNode.data.length] = []
                for(let k = 0; k<currentNode.data[j].length; k++) {
                    nextNode.data[nextNode.data.length-1][k] = currentNode.data[j][k];
                }
            }
        }
        if ((nextNode.data.length === 1)||(nextNode.atributeNumber === nextNode.data[0].length - 1)){
            return;
        }
        growBranch(nextNode);
    }
}

function getArrayOfBranches(data) {
    let gain = calculateGain(data);
    let atr = getUniqueAtributes(getColumnInMatrix(data, getIndexOfMaxElement(gain)));
    let branches = [];

    for (let i = 1; i < atr.length; i++) {
        branches[i-1] = new Node(atr[i], data[0][getIndexOfMaxElement(gain)], getIndexOfMaxElement(gain));
        if (gain.length === 1) {
            branches[i-1].nodeName = data[1][data[0].length - 1];
        }
    }
    return branches;
}

function getIndexOfMaxElement(array) {
    let max = -1;
    let ind;
    for (let i = 0; i < array.length; i++) {
        if (max <= array[i]) {
            max = array[i];
            ind = i;
        }
    }

    return ind;
}

function calculateGain(data) {
    let resultEntropy = countningUniqeAtributesByResult(getColumnInMatrix(data, data[0].length - 1), 
                                                        getColumnInMatrix(data, data[0].length - 1));
    let entropy = calculateEntropy(data);
    let gain = [];
    if (resultEntropy.length === 2) {
        for(let i = 0; i<data[0].length; i++) {
            gain[i] = 0
        }
        return gain
    }
    for (let i = 0; i < entropy.length; i++) {
        positive = 1;
        negative  = 2;
        if (resultEntropy[1][0] !== uniqueResults[0]) {
            positive, negative = negative, positive;
        }
        positive = resultEntropy[positive][1] / (data.length - 1);
        negative = resultEntropy[negative][2] / (data.length - 1);
        // number in log2 is need because positive or negative can be 0
        gain[i] = -(positive) * Math.log2(positive + 0.0000001) - (negative) * Math.log2(negative + 0.0000001);
        for (let j = 0; j < entropy[i].length; j++) {
            gain[i] = gain[i] - entropy[i][j] / (data.length - 1);
        }
    }

    return gain;
}

function calculateEntropy(data) {
    let entropy = [];
    for(let i = 0; i<data[0].length - 1; i++) {
        let unique = countningUniqeAtributesByResult(getColumnInMatrix(data, i), getColumnInMatrix(data, data[0].length - 1));
        entropy[i] = [];
        for(let j = 1; j<unique.length; j++) {
            let positive = unique[j][1] / (unique[j][1] + unique[j][2]);
            // number in log2 is need because positive or negative can be 0
            positive = - positive * Math.log2(positive + 0.0000001);
            let negtive = unique[j][2] / (unique[j][1] + unique[j][2]);
            negtive = - negtive * Math.log2(negtive + 0.00000001);
            entropy[i][j - 1] = (positive + negtive) * (unique[j][1] + unique[j][2]);
        }
    }

    return entropy;
}

function getColumnInMatrix(matrix, columnNumber) {
    let array = [];
    for(let i = 0; i<matrix.length; i++) {
        array[i] = matrix[i][columnNumber];
    }
    return array;
}

// function that returns matrix which contains all uniqe values and count of them relative to results
function countningUniqeAtributesByResult(array, result) {
    let matrix = []
    uniqueAtributes = getUniqueAtributes(array);
    for (let i = 0; i < uniqueAtributes.length; i++) {
        matrix[i] = [];
        matrix[i][0] = uniqueAtributes[i];
        for (let j = 0; j < uniqueResults.length; j++) {
            matrix[i][j + 1] = 0;
        }
    }
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < uniqueAtributes.length; j++) {
            if (array[i] === uniqueAtributes[j]) {
                for (let k = 0; k < uniqueResults.length; k++) {
                    if(result[i] === uniqueResults[k]) {
                        matrix[j][k + 1] ++;
                    }
                }
            }
        }
    }

    return matrix;
}

// function that returns array which contains all unique values from input array
function getUniqueAtributes(array) {
    let unique = [];
    let wasAdded;
    for (let i = 0; i < array.length; i++) {
        wasAdded = false
        for (let j = 0; j < unique.length; j++) {
            if (array[i] === unique[j]) {
                wasAdded = true;
                break;
            }
        }
        if (!wasAdded) {
            unique[unique.length] = array[i];
        }
    }

    return unique;
}