const canvas = document.getElementById('nodeCanvas');
const ctx = canvas.getContext('2d');
const renameInput = document.getElementById('renameInput');
const colorPicker = document.getElementById("colorPicker");
const {ipcRenderer} = require('electron');
const {GraphModel, viewPortModel} = require('./model.js');
const {selectEdge} = require('./edgeAux.js');
const {selectNode} = require('./nodeAux.js');

let model = new GraphModel();
let viewport = new viewPortModel();

//model.addNode(200, 200, "sd", "23", model.nodes.length, "red");
//model.addNode(250, 121, "sdsd", "asd23", model.nodes.length, "blue");

let mouseX = 0;
let mouseY = 0;

let renameBool = false;
let isCtrl = false

let selectedNode = null;
let selectedEdge = null;

let secondNode = null; //used for creating edges

let draggingNode = null; // Node being dragged
let offsetX, offsetY; // Offset for positioning the node during drag

let isPanning = false;
let startX, startY;

ipcRenderer.on('request-data', () =>{
  let data = model.saveToJson();
  console.log('data to save:');
  console.log(data);
  ipcRenderer.send('send-data', data);
});

// Listen for the 'save-complete' event
ipcRenderer.on('save-complete', (event, { success, filePath }) => {
  if (success) {
    console.log(`File saved successfully at: ${filePath}`);
    // You can also update the UI or inform the user of the file save completion
    alert(`File saved successfully at: ${filePath}`);
  } else {
    console.error('Failed to save the file.');
  }
});


ipcRenderer.on('load-data', (event, data) =>{
  model.loadFromJson(data);
  console.log('loaded data:');
  console.log(data);
  draw();
});

function getMousePos(event){
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / viewport.scale + viewport.x,
    y: (event.clientY - rect.top) / viewport.scale + viewport.y,
  };
}

// Detect clicking on a node   //NEED FIXING LATER
canvas.addEventListener('mousedown', (event) => {
  selectedNode = null;
  const {x, y} = getMousePos(event);

  if(isPanning){
    startX = x;
    startY = y;
  }else{
    selectedNode = selectNode(x, y, model.nodes);

    if(selectedNode){
      draggingNode = selectedNode;
      offsetX = x - selectedNode.x;
      offsetY = y - selectedNode.y;
    }else{
      selectedEdge = null;
      selectedEdge = selectEdge(x, y, model.edges, model.nodes);
    }
  }
  draw();
});

canvas.addEventListener("dblclick", (event) => {
  if(selectedNode){
    // Open the overview panel
    document.getElementById("overviewPanel").classList.add("visible");

    // Fill the editable div with the node's description
    document.getElementById("nodeDescription").innerText = selectedNode.description || '';    


    // Allow editing the description
    document.getElementById("nodeDescription").addEventListener("input", (e) => {
      selectedNode.description = e.target.innerText;  // Save to node object when edited
    });

    // When the close button is clicked, hide the panel
    document.getElementById("closeOverview").addEventListener("click", () => {
      document.getElementById("overviewPanel").classList.remove("visible");
    });

  }
});

//keeping track of mouse
canvas.addEventListener('mousemove', (event) => {
  const {x, y} = getMousePos(event);

  mouseX = x;
  mouseY = y;

  if(isPanning){
    const dx = x - startX;
    const dy = y - startY;
    viewport.x -= dx;
    viewport.y -= dy;
    startX = x;
    startY = y;
    draw();
  }

  if (draggingNode) {
    model.moveNode(draggingNode.index, x - offsetX, y - offsetY);
    draw();
  }
});

canvas.addEventListener('mouseup', () => {
  draggingNode = null; // Stop dragging when the mouse is released
  isPanning = false;
});


canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const zoomFactor = 1.1;
  const minScale = 0.3;
  const maxScale = 4;
  const { x: mouseXWorld, y: mouseYWorld } = getMousePos(event);

  if (event.deltaY < 0) {
    viewport.scale = Math.min(viewport.scale * zoomFactor, maxScale);
  } else {
    viewport.scale = Math.max(viewport.scale / zoomFactor, minScale);
  }

  viewport.x = mouseXWorld - (event.clientX - canvas.getBoundingClientRect().left) / viewport.scale;
  viewport.y = mouseYWorld - (event.clientY - canvas.getBoundingClientRect().top) / viewport.scale;

  draw();
}, {passive: false});

// this for creating edges
canvas.addEventListener('click', (event) => {
  
  if(selectedNode && isCtrl){
    if(secondNode === null){
      secondNode = selectedNode;
    }else if(secondNode != selectedNode && !model.findEdge(selectedNode.index, secondNode.index)){
      model.addEdge(selectedNode.index, secondNode.index, '');
      //selectedNode = null;
      secondNode = null;

      draw();
    }
  }
});

//different keys
document.addEventListener('keydown', (event) => {
  // n new r rename d delete p pan control control

  if(event.key === 'r' && !renameBool && selectedNode){
    renameBool = true;

    const rect = canvas.getBoundingClientRect();
    const screenX = (selectedNode.x - viewport.x) * viewport.scale + rect.left;
    const screenY = (selectedNode.y - viewport.y) * viewport.scale + rect.top;

    renameInput.style.display = 'block';
    renameInput.style.left = `${screenX - renameInput.offsetWidth / 2}px`; // Center horizontally
    renameInput.style.top = `${screenY - renameInput.offsetHeight / 2}px`; // Center vertically
    renameInput.value = selectedNode.label;
    renameInput.focus();
  }

  if(event.key === 'n' && !renameBool){
    model.addNode(mouseX, mouseY, 'Node ' + (model.nodes.length + 1), '', '');
    draw();
  }

  if(event.key === 'd' && !renameBool){
    if(selectedNode){
      model.removeNode(selectedNode.index);
      selectedNode = null; 
    }else if(selectedEdge){
      model.removeEdge(selectedEdge.nodeA, selectedEdge.nodeB);
      selectedEdge = null;
    }
    draw();
  }

  if(event.key === 'p' && !renameBool) {
    isPanning = !isPanning;
  }

  if(event.key === 'c' && !renameBool && selectedNode){

    if(colorPicker.style.display === 'block'){
      colorPicker.style.display = 'none';
    }else{
      colorPicker.style.display = 'block';
    }
  }

  if(event.key == 'm' && !renameBool && selectedNode){

    //node : child graph
    //node : child graph json filename
    //graph : parent graph DONE
    //graph : name


    //if the node does not have a child create one
    if(!selectedNode.childGraph){
      //create new graph
      let newModel = new GraphModel();
      newModel.name = selectedNode.label;
      selectedNode.childGraphFile = newModel.name;

      //reference in node
      selectedNode.childGraph = newModel;
      
      //set the reference to go back
      newModel.parentGraph = model;
    //  console.log(newModel.parentGraph.name);
    //  console.log(newModel.parentGraph);

      //load new graph
      model = newModel;


      //if(model.name === ''){
      //  model.name = 'main';
      //}

      //newModel.name = selectNode.label;


      //selectedNode.parentGraph = model;

      //new model, child of current node
      //let newModel = new GraphModel();
  
      //reference to current node to go back
      //newModel.parentNode = selectedNode;
  
      // assing new model to current node
      //selectedNode.childGraph = newModel;
  
    }else{
      //will have to load from json eventually
      model = selectedNode.childGraph;
      selectedNode = null;
    }

    //changing graph
    //model = selectedNode.childGraph;

    draw();

  }

  if(event.key == 'k' && !renameBool){
    //console.log(model.parentNode);
    let parentModel = model.parentGraph;
    //let oldModel = model.parentNode.parentGraph;
    model = parentModel;
    draw();

  }

  if(event.key === 'Control'){
    isCtrl = true;
  }

  if(event.key === '+' && selectedNode && !renameBool){
    model.changeNodeSize(selectedNode, 10);
    draw();
  }

  if(event.key === '-' && selectedNode && !renameBool){
    model.changeNodeSize(selectedNode, -10);
    draw();
  }

});

document.addEventListener('keyup', (event) =>{
  if(event.key === 'Control'){
    isCtrl = false;
  }
});


// Handle Rename
renameInput.addEventListener('blur', () => {
  if (selectedNode) {
    selectedNode.label = renameInput.value.trim() || selectedNode.label;
    draw();
  }
  renameInput.style.display = 'none';
  renameBool = false;
});

renameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    renameInput.blur();
  } else if (event.key === 'Escape') {
    renameInput.style.display = 'none';
    renameBool = false;
  }
});

// Update node color
colorPicker.addEventListener("input", (event) => {
  if (selectedNode) {
    selectedNode.color = event.target.value;
    draw();
  }
})


// Draw nodes and edges
function draw() {
  ctx.save();
  ctx.setTransform(
    viewport.scale, 0,
    0, viewport.scale,
    -viewport.x * viewport.scale,
    -viewport.y * viewport.scale
  );

  ctx.clearRect(viewport.x, viewport.y, canvas.width / viewport.scale, canvas.height / viewport.scale);

  // Draw edges
  model.edges.forEach((edge) => {
    const nodeA = model.nodes[edge.nodeA];
    const nodeB = model.nodes[edge.nodeB];

    ctx.strokeStyle = 'black';
    ctx.strokeStyle = (edge === selectedEdge) ? '#FFFAFA' : 'black';

    ctx.beginPath();
    ctx.moveTo(nodeA.x, nodeA.y);
    ctx.lineTo(nodeB.x, nodeB.y);
    ctx.stroke();
  });
  // Draw nodes
  model.nodes.forEach((node) => {

    ctx.strokeStyle = (node === selectedNode) ? '#FFFAFA' : 'black';
    ctx.lineWidth = (node === selectedNode) ? 5 : 2;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);

    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.stroke();

    //nodes labels
    ctx.font = '15px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(node.label, node.x - 15, node.y + 5);
  });

  ctx.restore();
}

draw();
