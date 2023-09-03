import { LcgGenerator } from "./LcgGenerator";
import { GraphNode } from "./GraphNode";
import { Tile } from "./Tile";
import { TileNode, TileType } from "./TileNode";

export type NewConnection = {
    node: GraphNode;
    previousNode: GraphNode;
};

export function generateEmpty2DGraph(
    sizeX: number,
    sizeY: number
): GraphNode[][] {
    const graph: GraphNode[][] = [];
    for (let x = 0; x < sizeX; x++) {
        graph[x] = [];
        for (let y = 0; y < sizeY; y++) {
            graph[x][y] = new GraphNode(x, y);
        }
    }
    return graph;
}

export function generateGridGraph(sizeX: number, sizeY: number, isConnected: boolean): Map<number,Map<number,GraphNode>> {
    const graph = new Map<number,Map<number,GraphNode>>();
    for (let x = 0; x < sizeX; x++) {
        graph.set(x, new Map<number,GraphNode>());
        for (let y = 0; y < sizeY; y++) {
            graph.get(x)?.set(y, new GraphNode(x, y));
        }
    }
    if(isConnected) {
        connectGridNodes(graph);
    }
    return graph;
}

export function connectGridNodes(graph: Map<number, Map<number, GraphNode>>) {
    graph.forEach((row, x) => {
        row.forEach((node, y) => {
            const northNode = graph.get(x)?.get(y - 1);
            const southNode = graph.get(x)?.get(y + 1);
            const eastNode = graph.get(x + 1)?.get(y);
            const westNode = graph.get(x - 1)?.get(y);
            if (northNode) {
                node.connections.push(northNode);
            }
            if (southNode) {
                node.connections.push(southNode);
            }
            if (eastNode) {
                node.connections.push(eastNode);
            }
            if (westNode) {
                node.connections.push(westNode);
            }
        });
    });
}

export function replicateGridGraph(graph: Map<number,Map<number,GraphNode>>, keepConnections: boolean = true) {
    const newGraph = new Map<number,Map<number,GraphNode>>();
    graph.forEach((row) => {
        row.forEach((node) => {
            if(!newGraph.has(node.x)) {
                newGraph.set(node.x, new Map<number,GraphNode>());
            }
            newGraph.get(node.x)?.set(node.y, new GraphNode(node.x, node.y));
        });
    });
    if(keepConnections) {
        graph.forEach((row) => {
            row.forEach((node) => {
                const newNode = newGraph.get(node.x)?.get(node.y);
                const existingConnections = graph.get(node.x)?.get(node.y)?.connections;
                existingConnections?.forEach((connection) => {
                    const connectedNode = newGraph.get(connection.x)?.get(connection.y);
                    if(connectedNode && newNode) {
                        newNode.connections.push(connectedNode);
                    }
                });
            });
        });
    }
    return newGraph;
}

export function generateEmptyTileGraph(
    sizeX: number,
    sizeY: number,
    wallType: TileType = TileType.WALL,
): TileNode[][] {
    const graph: TileNode[][] = [];
    for (let x = 0; x < sizeX; x++) {
        graph[x] = [];
        for (let y = 0; y < sizeY; y++) {
            graph[x][y] = new TileNode(x, y, wallType);
        }
    }
    return graph;
}

//export const generator = new LcgGenerator(3819201);

export function findDimensionsOfGraph(connectedGraph: Map<number,Map<number,GraphNode>>) {
    let sizeX = 0;
    let sizeY = 0;
    connectedGraph.forEach((row) => {
        row.forEach((node) => {
            if(node.x > sizeX) {
                sizeX = node.x;
            }
            if(node.y > sizeY) {
                sizeY = node.y;
            }
        });
    });
    sizeX++;
    sizeY++;
    return {sizeX, sizeY};
}

export function generateTileMazeWithStepDistance(graph: Map<number,Map<number,GraphNode>>, tileGraph: TileNode[][], nodeDistance: number, nodeDimension: number = 1, frameThickness: number = 1) {

    const {sizeX, sizeY} = findDimensionsOfGraph(graph);

    graph.forEach((row) => {
        row.forEach((node) => {
            const x = node.x;
            const y = node.y;
            const tileLeftTopCordX = frameThickness + nodeDimension * x + nodeDistance * x;
            const tileLeftTopCordY = frameThickness + nodeDimension * y + nodeDistance * y;

            for (let i = 0; i < nodeDimension; i++) {
                for (let j = 0; j < nodeDimension; j++) {
                    const tempTile = tileGraph[tileLeftTopCordX + i][tileLeftTopCordY + j];
                    tempTile.tileType = TileType.FLOOR;
                }
            }

            const hasSouthConnection  = node.connections.some(connection => connection.y === node.y && connection.x === (node.x + 1));
            const hasEastConnection  = node.connections.some(connection => connection.x === node.x && connection.y === (node.y + 1));
            
            if(hasEastConnection) {
                for(let i = 0; i < nodeDimension; i++) {
                    for(let j = 0; j < nodeDistance; j++) {
                        const tempTile = tileGraph[tileLeftTopCordX + i][tileLeftTopCordY + nodeDimension + j];
                        tempTile.tileType = TileType.FLOOR;
                    }
                }
            }
            if(hasSouthConnection) {
                for(let i = 0; i < nodeDistance; i++) {
                    for(let j = 0; j < nodeDimension; j++) {
                        const tempTile = tileGraph[tileLeftTopCordX + nodeDimension + i][tileLeftTopCordY + j];
                        tempTile.tileType = TileType.FLOOR;
                    }
                }
            }
        });
    });
    
    return tileGraph;
}

export function createTileArea(nodeDimension: number, sizeX: number, nodeDistance: number, frameThickness: number, sizeY: number) {
    const tileSizeX = nodeDimension * sizeX + (sizeX - 1) * nodeDistance + 2 * frameThickness;
    const tileSizeY = nodeDimension * sizeY + (sizeY - 1) * nodeDistance + 2 * frameThickness;
    const tileGraph = generateEmptyTileGraph(tileSizeX, tileSizeY);
    return tileGraph;
}

export function createSpiralGraph() {
    const maze = generateEmpty2DGraph(5, 5);
    maze[0][0].connections.push(maze[0][1], maze[1][0]);
    maze[0][1].connections.push(maze[0][0], maze[0][2]);
    maze[0][2].connections.push(maze[0][1], maze[0][3]);
    maze[0][3].connections.push(maze[0][2], maze[0][4]);
    maze[0][4].connections.push(maze[0][3]);

    maze[1][0].connections.push(maze[0][0], maze[2][0]);
    maze[2][0].connections.push(maze[1][0], maze[3][0]);
    maze[3][0].connections.push(maze[2][0], maze[4][0]);
    maze[4][0].connections.push(maze[3][0], maze[4][1]);

    maze[4][1].connections.push(maze[4][0], maze[4][2]);
    maze[4][2].connections.push(maze[4][1], maze[4][3]);
    maze[4][3].connections.push(maze[4][2], maze[4][4]);
    maze[4][4].connections.push(maze[4][3], maze[3][4]);

    maze[3][4].connections.push(maze[4][4], maze[2][4]);
    maze[2][4].connections.push(maze[3][4], maze[1][4]);
    maze[1][4].connections.push(maze[2][4], maze[1][3]);

    maze[1][3].connections.push(maze[1][4], maze[1][2]);
    maze[1][2].connections.push(maze[1][3], maze[1][1]);
    maze[1][1].connections.push(maze[1][2], maze[2][1]);

    maze[2][1].connections.push(maze[1][1], maze[3][1]);
    maze[3][1].connections.push(maze[2][1], maze[3][2]);
    maze[3][2].connections.push(maze[3][1], maze[3][3]);

    maze[3][3].connections.push(maze[3][2], maze[2][3]);
    maze[2][3].connections.push(maze[3][3], maze[2][2]);
    maze[2][2].connections.push(maze[2][3]);
    return maze;
}

export function generateMazeGraph(connectedGraph: Map<number,Map<number,GraphNode>>)  {
    const maze = replicateGridGraph(connectedGraph, false);
    const lcgGenerator = new LcgGenerator(3819201);

    const visitedNodes: Set<GraphNode> = new Set<GraphNode>();

    const startNode = connectedGraph.get(0)?.get(0) as GraphNode;

    const nodeStack: NewConnection[] = [];

    const start: NewConnection = {
        node: startNode,
        previousNode: startNode,
    };

    nodeStack.push(start);

    while (nodeStack.length > 0) {
        
        const currentMazeNode = nodeStack.pop();
        const node = currentMazeNode?.node as TileNode;
        const previousNode = currentMazeNode?.previousNode as TileNode;
        if (visitedNodes.has(node) === false) {
            if (node !== previousNode) {
                node.connections.push(previousNode);
                previousNode.connections.push(node);
            }

            visitedNodes.add(node);

            const northNode = maze.get(node.x)?.get(node.y - 1);
            const southNode = maze.get(node.x)?.get(node.y + 1);
            const eastNode = maze.get(node.x + 1)?.get(node.y);
            const westNode = maze.get(node.x - 1)?.get(node.y);
            

            let unvisitedConNodes: GraphNode[] = [];
            if (northNode && !visitedNodes.has(northNode)) {
                unvisitedConNodes.push(northNode);
            }
            if (southNode && !visitedNodes.has(southNode)) {
                unvisitedConNodes.push(southNode);
            }
            if (eastNode && !visitedNodes.has(eastNode)) {
                unvisitedConNodes.push(eastNode);
            }
            if (westNode && !visitedNodes.has(westNode)) {
                unvisitedConNodes.push(westNode);
            }

            if (unvisitedConNodes.length > 0) {
                while (unvisitedConNodes.length > 0) {
                    const randomIndex = Math.ceil(
                        lcgGenerator.nextInt() % unvisitedConNodes.length
                    );
                    const randomNode = unvisitedConNodes[randomIndex];
                    const newConnection: NewConnection = {
                        node: randomNode,
                        previousNode: node,
                    };
                    nodeStack.push(newConnection);
                    unvisitedConNodes = unvisitedConNodes.filter(
                        (node) => node !== randomNode
                    );
                }
            }
        }
    }

    return maze;
}
