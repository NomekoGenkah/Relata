//document aux

const { selectNode } = require("./nodeAux");

function addDocumentListeners(){



    //different keys
    document.addEventListener('keydown', (event) => {
        // n new r rename d delete p pan control control
    
        if(event.key === 'r' && !renameBool && selectedNode && !isWriting){
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
    
        if(event.key === 'n' && !renameBool && !isWriting){
        model.addNode(mouseX, mouseY, 'Node ' + (model.nodes.length + 1), '', '');
        draw();
        }
    
        if(event.key === 'd' && !renameBool && !isWriting){
        if(selectedNode){
            model.removeNode(selectedNode.index);
            selectedNode = null; 
        }else if(selectedEdge){
            model.removeEdge(selectedEdge.nodeA, selectedEdge.nodeB);
            selectedEdge = null;
        }
        draw();
        }
    
        if(event.key === 'p' && !renameBool && !isWriting) {
        isPanning = !isPanning;
        }
    
        if(event.key === 'c' && !renameBool && selectedNode && !isWriting){
    
        if(colorPicker.style.display === 'block'){
            colorPicker.style.display = 'none';
        }else{
            colorPicker.style.display = 'block';
        }
        }
    
        if(event.key == 'm' && !renameBool && selectedNode && !isWriting){
    
        if(!selectedNode.childGraph){
    
            let newModel = new GraphModel();
            selectedNode.childGraph = newModel;
            
            newModel.parentGraph = model;
    
            model = newModel;
        
        }else{
            //will have to load from json eventually
            model = selectedNode.childGraph;
            selectedNode = null;
        }
        draw();
        }
    
        if(event.key == 'k' && !renameBool && !isWriting){
        if(model.parentGraph){
            model = model.parentGraph;
            selectedNode = null;
            draw();
        }else{
            console.log('already at root Graph');
        }
        }
    
        if(event.key === 'Control'){
        isCtrl = true;
        }
    
        if(event.key === '+' && selectedNode && !renameBool && !isWriting){
        model.changeNodeSize(selectedNode, 10);
        draw();
        }
    
        if(event.key === '-' && selectedNode && !renameBool && !isWriting){
        model.changeNodeSize(selectedNode, -10);
        draw();
        }

        if(event.key === 'z' && selectedNode && !renameBool && isCtrl && !isWriting){
            copyNode = selectedNode;
        }

        if(event.key === 'v' && copyNode && !renameBool && isCtrl && !isWriting){
            model.addNode(mouseX, mouseY, copyNode.label, copyNode.description, copyNode.overview, copyNode.childGraph);

            console.log("copiado?")

            draw();
        }
    
    });
    
    
    document.addEventListener('keyup', (event) =>{
        if(event.key === 'Control'){
        isCtrl = false;
        }
    });
  









































}

module.exports = {addDocumentListeners};