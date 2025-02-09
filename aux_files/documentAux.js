//document aux

const {getXY} = require('./edgeAux.js');

function addDocumentListeners(){

    //different keys
    document.addEventListener('keydown', (event) => {

        if(event.key === 'Control'){
            isCtrl = true;
        }

        if(renameBool || isWriting){
            return
        }
        // n new r rename d delete p pan control control
    
        if(event.key === 'r'){
            renameBool = true;

            if(selectedNode){
                const rect = canvas.getBoundingClientRect();
                const screenX = (selectedNode.x - viewport.x) * viewport.scale + rect.left;
                const screenY = (selectedNode.y - viewport.y) * viewport.scale + rect.top;
            
                renameInput.style.display = 'block';
                renameInput.style.left = `${screenX - renameInput.offsetWidth / 2}px`; // Center horizontally
                renameInput.style.top = `${screenY - renameInput.offsetHeight / 2}px`; // Center vertically
                renameInput.value = selectedNode.label;
                renameInput.focus();

            }else if(selectedEdge){
                let x, y = getXY(selectedEdge, model.nodes);

                const rect = canvas.getBoundingClientRect();
                const screenX = (x - viewport.x) * viewport.scale + rect.left;
                const screenY = (y - viewport.y) * viewport.scale + rect.top;
            
                renameInput.style.display = 'block';
                renameInput.style.left = `${screenX - renameInput.offsetWidth / 2}px`; // Center horizontally
                renameInput.style.top = `${screenY - renameInput.offsetHeight / 2}px`; // Center vertically
                renameInput.value = selectedEdge.connection;
                renameInput.focus();
            }        
        }
    
        if(event.key === 'n'){
        model.addNode(mouseX, mouseY, 'Node ' + (model.nodes.length + 1), '', '');
        draw();
        }
    
        if(event.key === 'd'){
            if(selectedNode){
                model.removeNode(selectedNode.index);
                selectedNode = null; 
            }else if(selectedEdge){
                model.removeEdge(selectedEdge.nodeA, selectedEdge.nodeB);
                selectedEdge = null;
            }
            draw();
        }
    
        if(event.key === 'p' && selectedNode){
            if(colorPicker.style.display === 'block'){
                colorPicker.style.display = 'none';
            }else{
                colorPicker.style.display = 'block';
        }
        }
    
        if(event.key == 'm' && selectedNode){
        
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
    
        if(event.key == 'k'){
            if(model.parentGraph){
                model = model.parentGraph;
                selectedNode = null;
                draw();
            }else{
                console.log('already at root Graph');
            }
        }
    
        if(event.key === '+' && selectedNode){
            model.changeNodeSize(selectedNode, 10);
            draw();
        }
    
        if(event.key === '-' && selectedNode){
            model.changeNodeSize(selectedNode, -10);
            draw();
        }

        if(event.key === 'c' && selectedNode && isCtrl){
            copyNode = selectedNode;
        }

        if(event.key === 'v' && copyNode && isCtrl){
            model.addNode(mouseX, mouseY, copyNode.label, copyNode.description, copyNode.overview, copyNode.childGraph);
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