import { LcgGenerator } from "./LcgGenerator";
import { GraphNode } from "./GraphNode";
import { TileNode, TileType } from "./TileNode";

export type NewConnection = {
    node: GraphNode;
    previousNode: GraphNode;
};

export function generateGridGraph(sizeX: number, sizeY: number, isConnected: boolean): Map<number, Map<number, GraphNode>> {
    const graph = new Map<number, Map<number, GraphNode>>();
    for (let x = 0; x < sizeX; x++) {
        graph.set(x, new Map<number, GraphNode>());
        for (let y = 0; y < sizeY; y++) {
            graph.get(x)?.set(y, new GraphNode(x, y));
        }
    }
    if (isConnected) {
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

export function replicateGridGraph(graph: Map<number, Map<number, GraphNode>>, keepConnections: boolean = true) {
    const newGraph = new Map<number, Map<number, GraphNode>>();
    graph.forEach((row) => {
        row.forEach((node) => {
            if (!newGraph.has(node.x)) {
                newGraph.set(node.x, new Map<number, GraphNode>());
            }
            newGraph.get(node.x)?.set(node.y, new GraphNode(node.x, node.y));
        });
    });
    if (keepConnections) {
        graph.forEach((row) => {
            row.forEach((node) => {
                const newNode = newGraph.get(node.x)?.get(node.y);
                const existingConnections = graph.get(node.x)?.get(node.y)?.connections;
                existingConnections?.forEach((connection) => {
                    const connectedNode = newGraph.get(connection.x)?.get(connection.y);
                    if (connectedNode && newNode) {
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

export function findDimensionsOfGraph(connectedGraph: Map<number, Map<number, GraphNode>>) {
    let sizeX = 0;
    let sizeY = 0;
    connectedGraph.forEach((row) => {
        row.forEach((node) => {
            if (node.x > sizeX) {
                sizeX = node.x;
            }
            if (node.y > sizeY) {
                sizeY = node.y;
            }
        });
    });
    sizeX++;
    sizeY++;
    return { sizeX, sizeY };
}

export function generateTileMazeWithStepDistance(graph: Map<number, Map<number, GraphNode>>, tileGraph: TileNode[][], nodeDistance: number, nodeDimension: number = 1, frameThickness: number = 1) {

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

            const hasSouthConnection = node.connections.some(connection => connection.y === node.y && connection.x === (node.x + 1));
            const hasEastConnection = node.connections.some(connection => connection.x === node.x && connection.y === (node.y + 1));

            if (hasEastConnection) {
                for (let i = 0; i < nodeDimension; i++) {
                    for (let j = 0; j < nodeDistance; j++) {
                        const tempTile = tileGraph[tileLeftTopCordX + i][tileLeftTopCordY + nodeDimension + j];
                        tempTile.tileType = TileType.FLOOR;
                    }
                }
            }
            if (hasSouthConnection) {
                for (let i = 0; i < nodeDistance; i++) {
                    for (let j = 0; j < nodeDimension; j++) {
                        const tempTile = tileGraph[tileLeftTopCordX + nodeDimension + i][tileLeftTopCordY + j];
                        tempTile.tileType = TileType.FLOOR;
                    }
                }
            }
        });
    });

    return tileGraph;
}

export function createTileArea(nodeDimension: number, sizeX: number, nodeDistance: number, frameOffset: number, sizeY: number) {
    const tileSizeX = nodeDimension * sizeX + (sizeX - 1) * nodeDistance + 2 * frameOffset;
    const tileSizeY = nodeDimension * sizeY + (sizeY - 1) * nodeDistance + 2 * frameOffset;
    const tileGraph = generateEmptyTileGraph(tileSizeX, tileSizeY);
    return tileGraph;
}

export function resetTileGraph(tileGraph: TileNode[][]) {
    tileGraph.forEach((row) => {
        row.forEach((node) => {
            node.tileType = TileType.WALL;
        });
    });
}

export function generateMazeGraph(connectedGraph: Map<number, Map<number, GraphNode>>) {
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

export function extractSkeletonGraph(tileGraph: TileNode[][] ,frameOffset: number, innerNodeDimension: number, innerNodeDistance: number) {
    let x = 0;
    let y = 0;
  
    const startOffset = frameOffset;
    let tileLeftTopCordX = startOffset + innerNodeDimension * x + innerNodeDistance * x;
    let tileLeftTopCordY = startOffset + innerNodeDimension * y + innerNodeDistance * y;
  
    const newSkeletonGraphConnected: Map<number, Map<number, GraphNode>> = new Map();
  
    while ((tileLeftTopCordX + innerNodeDimension) <= tileGraph.length) {
      newSkeletonGraphConnected.set(x, new Map());
      while ((tileLeftTopCordY + innerNodeDimension) <= tileGraph[0].length) {
  
        //add a node to new graph skeleton
        if (tileGraph[tileLeftTopCordX][tileLeftTopCordY].tileType === TileType.FLOOR) {
          newSkeletonGraphConnected.get(x)?.set(y, new GraphNode(x, y));
        }
        y++;
        tileLeftTopCordY = frameOffset + innerNodeDimension * y + innerNodeDistance * y;
      }
      x++;
      tileLeftTopCordX = frameOffset + innerNodeDimension * x + innerNodeDistance * x;
      y = 0;
      tileLeftTopCordY = frameOffset + innerNodeDimension * y + innerNodeDistance * y;
    }
    return newSkeletonGraphConnected;
  }

  export function addInnerMaze(tileGraph: TileNode[][], innerNodeDistance: number, innerNodeDimension: number, frameOffset: number ) {

    let newSkeletonGraphConnected: Map<number, Map<number, GraphNode>> = extractSkeletonGraph(tileGraph, frameOffset, innerNodeDimension, innerNodeDistance);

    connectGridNodes(newSkeletonGraphConnected);

    resetTileGraph(tileGraph);
    let newSkeletonGraph = generateMazeGraph(newSkeletonGraphConnected);
    return generateTileMazeWithStepDistance(newSkeletonGraph,tileGraph,innerNodeDistance,innerNodeDimension,frameOffset);
  }