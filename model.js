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
         //   throw new Error('Invalid node index');
            throw new Error(`Node with index ${nodeIndex} does not exist.`);
        }
    }

    changeNodeSize(node, change){
        node.size += change;
        if(node.size < 10) node.size = 10;
        if(node.size > 150) node.size = 150;
    }

    saveToJson() {
        //x, y, label = '', overview = '', description = '', color = 'green', size = 50, index
        return JSON.stringify(this, (key, value) => {
            // Exclude circular references like parentGraph
            if (key === 'parentGraph') return undefined;
            return value;
        }, 2);
    }

    loadFromJson(data) {
        try {
            const graphData = JSON.parse(data);
    
            if (Array.isArray(graphData.nodes) && Array.isArray(graphData.edges)) {
                this.nodes = graphData.nodes.map((node, index) => {
                    const loadedNode = new NodeModel(
                        node.x,
                        node.y,
                        node.label,
                        node.overview,
                        node.description,
                        node.color,
                        node.size,
                        node.index,
                    );
                    if (node.childGraph) {
                        const childGraph = new GraphModel();
                        childGraph.loadFromJson(JSON.stringify(node.childGraph)); // Load the child graph recursively
                        childGraph.parentGraph = this; // Set parentGraph reference
                        loadedNode.childGraph = childGraph;
                    }
                    return loadedNode;
                });
    
                this.edges = graphData.edges.map(edge => new EdgeModel(edge.nodeA, edge.nodeB, edge.connection));
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
