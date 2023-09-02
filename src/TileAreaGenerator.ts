import { LcgGenerator } from "./LcgGenerator";
import { GraphNode } from "./GraphNode";
import { Tile } from "./Tile";
import { TileNode, TileType } from "./TileNode";

export type NewConnection = {
    node: GraphNode;
    previousNode: GraphNode;
};

export function generateEmptyGraph(
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

export function generateTileMazeWithStepDistance(sizeX: number, sizeY: number, nodeDistance: number, nodeDimension: number = 1, frameThickness: number = 1) {
    const graph = generateMazeGraph(sizeX, sizeY);
    const tileSizeX = nodeDimension * sizeX + (sizeX - 1) * nodeDistance + 2 * frameThickness;
    const tileSizeY = nodeDimension * sizeY + (sizeY - 1) * nodeDistance + 2 * frameThickness;
    const tileGraph = generateEmptyTileGraph(tileSizeX, tileSizeY);

    graph.forEach((row, x) => {
        row.forEach((node, y) => {
            const tileCordX = frameThickness + nodeDimension * x + nodeDistance * x;
            const tileCordY = frameThickness + nodeDimension * y + nodeDistance * y;

            for (let i = 0; i < nodeDimension; i++) {
                for (let j = 0; j < nodeDimension; j++) {
                    const tempTile = tileGraph[tileCordX + i][tileCordY + j];
                    tempTile.tileType = TileType.FLOOR;
                }
            }

            const hasSouthConnection  = node.connections.some(connection => connection.y === node.y && connection.x === (node.x + 1));
            const hasEastConnection  = node.connections.some(connection => connection.x === node.x && connection.y === (node.y + 1));
            
            if(hasEastConnection) {
                for(let i = 0; i < nodeDimension; i++) {
                    for(let j = 0; j < nodeDistance; j++) {
                        const tempTile = tileGraph[tileCordX + i][tileCordY + nodeDimension + j];
                        tempTile.tileType = TileType.FLOOR;
                    }
                }
            }
            
            
            if(hasSouthConnection) {
                for(let i = 0; i < nodeDistance; i++) {
                    for(let j = 0; j < nodeDimension; j++) {
                        const tempTile = tileGraph[tileCordX + nodeDimension + i][tileCordY + j];
                        tempTile.tileType = TileType.FLOOR;
                    }
                }
            }
        });
    });
    return tileGraph;
}

export function createSpiralGraph() {
    const maze = generateEmptyGraph(5, 5);
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

export function generateMazeGraph(sizeX: number, sizeY: number) {
    const maze = generateEmptyGraph(sizeX, sizeY);
    const lcgGenerator = new LcgGenerator(3819201);

    const visitedNodes: Set<GraphNode> = new Set<GraphNode>();

    const randomStartPointX = lcgGenerator.nextInt() % sizeX;
    const randomStartPointY = lcgGenerator.nextInt() % sizeY;

    const nodeStack: NewConnection[] = [];

    const startNode = maze[randomStartPointX][randomStartPointY];

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

            const northNode = maze[node.x]?.[node.y - 1];
            const southNode = maze[node.x]?.[node.y + 1];
            const eastNode = maze[node.x + 1]?.[node.y];
            const westNode = maze[node.x - 1]?.[node.y];

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
