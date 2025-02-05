//document aux

function addDocumentListeners(){



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
    
        if(event.key == 'k' && !renameBool){
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
  









































}

module.exports = {addDocumentListeners};