const canvas = document.getElementById('nodeCanvas');
const ctx = canvas.getContext('2d');

// Draw nodes and edges
function draw(){
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

module.exports = {draw};