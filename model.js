const fs = require('fs');

class NodeModel {
    constructor(x, y, label = '', overview = '', description = '', color = 'green', index){
        this.x = x;
        this.y = y;
        this.label = label;
        this.overview = overview;
        this.description = description;
        this.index = index;
        this.color = color;
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
        this.nodes = [];
        this.edges = [];
    }

    addNode(x, y, label, description = '', overview = '', color, index = this.nodes.length) {
        const newNode = new NodeModel(x, y, label, overview, description, color, index);
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

    saveToFile(filename) {
        try {
            const graphData = {
                nodes: this.nodes,
                edges: this.edges,
            };
            fs.writeFileSync(filename, JSON.stringify(graphData, null, 2), 'utf-8');
        } catch (error) {
            console.error('Failed to save graph:', error);
        }
    }

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
    
    loadFromFile(filename) {
        try {
            if (fs.existsSync(filename)) {
                const graphData = JSON.parse(fs.readFileSync(filename, 'utf-8'));
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
            } else {
                throw new Error('File does not exist');
            }
        } catch (error) {
            console.error('Failed to load graph:', error);
        }
    }

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

module.exports = { NodeModel, EdgeModel, GraphModel };
