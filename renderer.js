const canvas = document.getElementById('nodeCanvas');
const ctx = canvas.getContext('2d');
const renameInput = document.getElementById('renameInput');
const {GraphModel} = require('./model.js');
const {selectEdge, isMouseNearEdge} = require('./edgeAux.js');

model = new GraphModel();

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

    //const nodeA = edge.nodeA;
    //const nodeB = edge.nodeB;

    ctx.beginPath();
    ctx.moveTo(nodeA.x, nodeA.y);
    ctx.lineTo(nodeB.x, nodeB.y);
    ctx.stroke();
  });
  // Draw nodes
  model.nodes.forEach((node) => {
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
  //console.log("x: " + mouseX + " y: " + mouseY);



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
  selectedNode = null;
  selectedEdge = null;

  model.nodes.forEach((node) => {
    const dist = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
    //console.log("distance: " + dist);
    if (dist < 40) {
      selectedNode = node; // Store the clicked node as selected

      draggingNode = node;
      offsetX = mouseX - node.x;
      offsetY = mouseY - node.y;
    }
  });

  if(!selectedNode){
    selectedEdge = selectEdge(mouseX, mouseY, model.edges, model.nodes);
  }

});


model.addNode(200, 200, "sd", "23", model.nodes.length);
model.addNode(250, 121, "sdsd", "asd23", model.nodes.length);

//adding edges selectig nodes selecting edges    use of index vs node itself  CHANGE
canvas.addEventListener('click', (event) => {
  console.log("click");
  //selectedNode = null;
  //selectedEdge = null;

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

//add node when n
document.addEventListener('keydown', (event) => {
  if (event.key === 'n' && !renameBool) {
    x = event.offsetX - offsetX;
    y = event.offsetY - offsetY;

  //  x = Math.random() * canvas.width,
  //  y = Math.random() * canvas.height,
    label = 'Node ' + (model.nodes.length + 1),

    model.addNode(mouseX, mouseY, label, '', '');
    //console.log(model.nodes.length);
    //console.log(model.nodes[model.nodes.length - 1]);
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

