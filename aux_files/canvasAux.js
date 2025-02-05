//document aux

function addCanvasListeners(){

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


}

module.exports = {addCanvasListeners};