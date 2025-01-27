const canvas = document.getElementById('nodeCanvas');
const ctx = canvas.getContext('2d');
const renameInput = document.getElementById('renameInput');
const {GraphModel} = require('./model.js');
const {selectEdge} = require('./edgeAux.js');
const {selectNode} = require('./nodeAux.js');

model = new GraphModel();

model.addNode(200, 200, "sd", "23", model.nodes.length);
model.addNode(250, 121, "sdsd", "asd23", model.nodes.length);

let mouseX = 0;
let mouseY = 0;

let renameBool = false;
let isCtrl = false

let selectedNode = null;
let selectedEdge = null;

let secondNode = null; //used for creating edges

let draggingNode = null; // Node being dragged
let offsetX, offsetY; // Offset for positioning the node during drag


// Draw nodes and edges
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  model.edges.forEach((edge) => {
    const nodeA = model.nodes[edge.nodeA];
    const nodeB = model.nodes[edge.nodeB];

    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(nodeA.x, nodeA.y);
    ctx.lineTo(nodeB.x, nodeB.y);
    ctx.stroke();
  });
  // Draw nodes
  model.nodes.forEach((node) => {

    ctx.strokeStyle = (node === selectedNode) ? 'white' : 'black';

    ctx.beginPath();
    ctx.arc(node.x, node.y, 50, 0, Math.PI * 2);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.stroke();

    //nodes labels
    ctx.font = '15px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(node.label, node.x - 5, node.y + 5);
  });
}

//keeping track of mouse
canvas.addEventListener('mousemove', (event) => {

  mouseX = event.offsetX;
  mouseY = event.offsetY;

  if(draggingNode){
    // Update the node's position while dragging
    const x = mouseX - offsetX;
    const y = mouseY - offsetY;

    model.moveNode(draggingNode.index, x, y);

    draw();
  }

});

// Detect clicking on a node   //NEED FIXING LATER
canvas.addEventListener('mousedown', (event) => {
  //selectedNode = null;
  selectedEdge = null;

  selectedNode = selectNode(mouseX, mouseY, model.nodes);

  if(selectedNode){
    draggingNode = selectedNode;
    offsetX = mouseX - selectedNode.x;
    offsetY = mouseY - selectedNode.y;
  }else{
    selectedEdge = selectEdge(mouseX, mouseY, model.edges, model.nodes);
  }

  draw();
});

// this for creating edges
canvas.addEventListener('click', (event) => {
  console.log("click");

  if(selectedNode === secondNode || !isCtrl){return}

  if (selectedNode !== null) {
    if (secondNode === null) {
      secondNode = selectedNode; // First node selected
    } else {
      console.log("here?");
      // Add an edge between the selected node and the clicked node
      let nodeAIndex = selectedNode.index;
      let nodeBIndex = secondNode.index;
      //console.log("nodeA: " + nodeAINdex);
      //console.log("nodeB: " + nodeBINdex);
      model.addEdge(nodeAIndex, nodeBIndex, '');
      //model.edges.push(edge);
      secondNode = null; // Reset the selected node
    }
    draw(); // Redraw after the edge is added
  }

  //selecting edges
});

canvas.addEventListener('mouseup', () => {
  draggingNode = null; // Stop dragging when the mouse is released
});

//different keys
document.addEventListener('keydown', (event) => {
  if (event.key === 'n' && !renameBool) {
    x = event.offsetX - offsetX;
    y = event.offsetY - offsetY;

    label = 'Node ' + (model.nodes.length + 1),

    model.addNode(mouseX, mouseY, label, '', '');
  }

  if(event.key === 's' && !renameBool){
    model.saveToFile("datos");
  }

  if(event.key === 'l' && !renameBool){
    model.loadFromFile("datos");
  }

  if(event.key === 'd' && !renameBool){

    if(selectedNode){
      model.removeNode(selectedNode.index);
      selectedNode = null;
    }else if(selectedEdge){
      model.removeEdge(selectedEdge.nodeA, selectedEdge.nodeB);
    }
  }

  if(event.key === 'r' && !renameBool){
    renameBool = true;
    renameInput.style.display = 'block';
    renameInput.style.left = `${selectedNode.x}px`;
    renameInput.style.top = `${selectedNode.y}px`;
    renameInput.value = selectedNode.label;
    renameInput.focus();
    //renameInput.value = "";
  }

  if(event.key === 'Control' ){
    isCtrl = true;
    console.log("caca");
  }

  draw();
});

document.addEventListener('keyup', (event) =>{
  if(event.key === 'Control'){
    isCtrl = false;
    console.log("pipi");
  }

});

// Handle rename input confirmation
renameInput.addEventListener('blur', () => {
  if (selectedNode) {
    const newName = renameInput.value.trim();
    if (newName) {
      selectedNode.label = newName; // Update the node label
      draw(); // Redraw the canvas
    }
  }
  if(!renameBool){
    renameInput.style.display = 'none'; // Hide the input
  }
});

renameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    renameBool = false;
    renameInput.blur(); // Confirm the rename when Enter is pressed
  } else if (event.key === 'Escape') {
    renameBool = false;
    renameInput.style.display = 'none'; // Cancel renaming on Escape
  }
});

draw();

