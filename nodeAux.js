
function selectNode(mouseX, mouseY, nodes){
    for(let node of nodes){
        const dist = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
        if(dist < 40){
            return node;
        }
    }

    return null;
}

module.exports = {selectNode};