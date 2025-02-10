const canvas = document.getElementById('nodeCanvas');
const ctx = canvas.getContext('2d');
const renameInput = document.getElementById('renameInput');
const colorPicker = document.getElementById("colorPicker");
const {ipcRenderer} = require('electron');
const {GraphModel, viewPortModel} = require('./model.js');
const {draw} = require('./aux_files/drawing.js');
const {addCanvasListeners} = require('./aux_files/canvasAux.js');
const {addDocumentListeners} = require('./aux_files/documentAux.js');
const {addRenameListeners, addColorListeners} = require('./aux_files/othersAux.js');


let model = new GraphModel();
let viewport = new viewPortModel();

let mouseX = 0;
let mouseY = 0;

let renameBool = false;
let isCtrl = false

let selectedNode = null;
let selectedEdge = null;

let secondNode = null; //used for creating edges

let copyNode = null;

let draggingNode = null; // Node being dragged
let offsetX, offsetY; // Offset for positioning the node during drag

let isPanning = false;
let startX, startY;

let isWriting = false;

ipcRenderer.on('request-data', () => {
  // Serialize the main graph to JSON
  const data = model.saveToJson();
  console.log('Data to save:');
  console.log(data);
  ipcRenderer.send('send-data', data); // Send serialized data back to main process
});

ipcRenderer.on('load-data', (event, data) => {
  // Load the main graph from JSON
  model = new GraphModel(); // Create a new GraphModel instance
  model.loadFromJson(data);
  console.log('Loaded data:');
  console.log(model);
  draw(viewport, model); // Redraw the graph
});


function getMousePos(event){
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / viewport.scale + viewport.x,
    y: (event.clientY - rect.top) / viewport.scale + viewport.y,
  };
}

addCanvasListeners();
addDocumentListeners();
addRenameListeners();
addColorListeners();

draw();
