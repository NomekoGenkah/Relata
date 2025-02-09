//others aux

function addRenameListeners(){

        // Handle Rename
    renameInput.addEventListener('blur', () => {
        if (selectedNode) {
            selectedNode.label = renameInput.value.trim() || selectedNode.label;
            draw();
        }else if(selectedEdge){
            selectedEdge.connection = renameInput.value.trim() || selectedNode.connection;
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


}


function addColorListeners(){
    // Update node color
    colorPicker.addEventListener("input", (event) => {
        if(selectedNode){
            selectedNode.color = event.target.value;
            draw();
        }
    })
}

module.exports = {addRenameListeners, addColorListeners};