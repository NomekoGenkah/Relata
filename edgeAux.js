//Edge aux

function selectEdge(mouseX, mouseY, edges, nodes) {
    const threshold = 7; // Pixels within which an edge is considered "selected"
    let selectedEdge = null;

    edges.forEach(edge => {
        const nodeA = nodes[edge.nodeA];
        const nodeB = nodes[edge.nodeB];

        if (isMouseNearEdge(mouseX, mouseY, nodeA.x, nodeA.y, nodeB.x, nodeB.y, threshold)) {
            selectedEdge = edge;
        }
    });

    return selectedEdge;
}

function isMouseNearEdge(mouseX, mouseY, x1, y1, x2, y2, threshold) {
    const A = mouseX - x1;
    const B = mouseY - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;

    let closestX, closestY;

    if (param < 0) {
        closestX = x1;
        closestY = y1;
    } else if (param > 1) {
        closestX = x2;
        closestY = y2;
    } else {
        closestX = x1 + param * C;
        closestY = y1 + param * D;
    }

    const distX = mouseX - closestX;
    const distY = mouseY - closestY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance < threshold;
}

module.exports = { selectEdge, isMouseNearEdge };
