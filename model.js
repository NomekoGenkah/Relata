const fs = require('fs');

class NodeModel {
    constructor(x, y, label = '', overview = '', description = '', color = 'green', size = 50, index){
        this.x = x;
        this.y = y;
        this.label = label;
        this.overview = overview;
        this.description = description;
        this.color = color;
        this.size = size;
        this.index = index;
        this.childGraphFile = null;
        this.childGraph = null;
    }
}

class viewPortModel{
    constructor(x = 0, y = 0, scale = 1){
        this.x = x;
        this.y = y;
        this.scale = scale;
    }
}

class EdgeModel {
    constructor(nodeA, nodeB, connection = '') {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.connection = connection;
    }
}

class GraphModel {
    constructor() {
        this.name = '';
        this.nodes = [];
        this.edges = [];
        this.parentGraph = null;
    }

    addNode(x, y, label, description = '', overview = '', color, size = 50, index = this.nodes.length) {
        const newNode = new NodeModel(x, y, label, overview, description, color, size, index);
        this.nodes.push(newNode);
    }

    removeNode(nodeIndex) {
        this.edges = this.edges.filter(
            edge => edge.nodeA !== nodeIndex && edge.nodeB !== nodeIndex
        );
    
        this.nodes.splice(nodeIndex, 1);
    
        this.nodes.forEach((node, index) => {
            node.index = index;
        });
    
        this.edges.forEach(edge => {
            if (edge.nodeA > nodeIndex) edge.nodeA--;
            if (edge.nodeB > nodeIndex) edge.nodeB--;
        });
    }      

    addEdge(nodeA, nodeB, connection = '') {
        const newEdge = new EdgeModel(nodeA, nodeB, connection);
        this.edges.push(newEdge);
    }

    findEdge(nodeA, nodeB){
        for(let edge of this.edges){
            if(edge.nodeA === nodeA && edge.nodeB === nodeB){
                return true;
            }
            if(edge.nodeA === nodeB && edge.nodeB === nodeA){
                return true;
            }
        }
        return false;
    }

    removeEdge(nodeAIndex, nodeBIndex) {

        // Filter out the edge that connects the specified nodes
        this.edges = this.edges.filter(edge => 
          !(edge.nodeA === nodeAIndex && edge.nodeB === nodeBIndex) &&
          !(edge.nodeA === nodeBIndex && edge.nodeB === nodeAIndex)
        );
    }
      

    moveNode(nodeIndex, x, y) {
        if (nodeIndex >= 0 && nodeIndex < this.nodes.length) {
            const node = this.nodes[nodeIndex];
            node.x = x;
            node.y = y;
        } else {
            throw new Error('Invalid node index');
        }
    }

    changeNodeSize(node, change){
        node.size += change;
        if(node.size < 10) node.size = 10;
        if(node.size > 150) node.size = 150;
    }

    /*
    saveToJson() {
        try {
            const graphData = {
                nodes: this.nodes,
                edges: this.edges,
            };
            return JSON.stringify(graphData, null, 2); // Return the JSON string
        } catch (error) {
            console.error('Failed to serialize graph:', error);
            return null; // Return null in case of an error
        }
    }
    */

    saveToJson() {
        let parentGraph = (this.parentGraph) ? this.parentGraph.name : null;
        try {
            const graphData = {
                name : this.name,
                nodes: this.nodes.map((node) => ({
                    x: node.x,
                    y: node.y,
                    label: node.label,
                    overview: node.overview,
                    description: node.description,
                    color: node.color,
                    size: node.size,
                    index: node.index,
                    childGraphFile: node.childGraphFile,
                })),
                edges: this.edges,
                parentGraph: parentGraph, 
            };
            return JSON.stringify(graphData, null, 2);
        } catch (error) {
            console.error('Failed to serialize graph:', error);
            return null;
        }
    }
/*
    saveAllToJson(graph, basePath = './') {
        try {
            // Determine the file name
            const fileName = `${sanitizeFilename(graph.parentNode?.label || 'main')}.json`;
            const filePath = path.join(basePath, fileName);

            // Save the current graph
            const graphData = graph.saveToJson();
            if (graphData) {
                fs.writeFileSync(filePath, graphData, 'utf-8');
                console.log(`Graph saved to: ${filePath}`);
            }

            // Save child graphs recursively
            for (let node of graph.nodes) {
                if (node.childGraph) {
                    node.childGraphFile = `${sanitizeFilename(node.label)}.json`; // Assign filename
                    this.saveAllToJson(node.childGraph, basePath); // Save the child graph
                    node.childGraph = null; // Clear in-memory reference
                }
            }
        } catch (error) {
            console.error('Failed to save all graphs:', error);
        }
    }
*/

    

    loadFromJson(jsonString) {
        try {
            const graphData = JSON.parse(jsonString);
            if (Array.isArray(graphData.nodes) && Array.isArray(graphData.edges)) {
                this.nodes = graphData.nodes.map(
                    node => new NodeModel(node.x, node.y, node.label, node.overview, node.description, node.color, node.index)
                );
                this.edges = graphData.edges.map(
                    edge => new EdgeModel(edge.nodeA, edge.nodeB, edge.connection)
                );
            } else {
                throw new Error('Invalid graph data format');
            }
        } catch (error) {
            console.error('Failed to load graph from JSON:', error);
        }
    }
    

}

// Helper function for safe filenames
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

module.exports = { NodeModel, EdgeModel, GraphModel, viewPortModel };
