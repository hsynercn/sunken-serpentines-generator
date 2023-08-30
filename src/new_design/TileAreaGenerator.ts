import { LcgGenerator } from "./LcgGenerator";
import { GraphNode } from "./Node";
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
    wallType: TileType = TileType.wall,
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

export function generateTileMazeWithStepDistance(sizeX: number, sizeY: number, stepDistance: number, frameThickness: number = 1) {
    const graph = generateMazeGraph(sizeX, sizeY);
    const tileSizeX = sizeX + (sizeX - 1) * stepDistance + 2 * frameThickness;
    const tileSizeY = sizeY + (sizeY - 1) * stepDistance + 2 * frameThickness;
    const tileGraph = generateEmptyTileGraph(tileSizeX, tileSizeY);
    graph.forEach((column, x) => {
        column.forEach((node, y) => {
            const tileCordX = frameThickness + x + stepDistance * x;
            const tileCordY = frameThickness + y + stepDistance * y;
            const tileNode = tileGraph[tileCordX][tileCordY];
            tileNode.tileType = TileType.floor;
            const hasEastConnection = node.connections.find(connection => connection.x === node.x + 1);
            const hasSouthConnection = node.connections.find(connection => connection.y === node.y + 1);
            if(hasEastConnection) {
                for(let i = 0; i <= stepDistance; i++) {
                    const tempTile = tileGraph[tileCordX + i][tileCordY];
                    const nextTile = tileGraph[tileCordX + i + 1][tileCordY];
                    tempTile.tileType = TileType.floor;
                    tempTile.connections.push(nextTile);
                    nextTile.connections.push(tempTile);
                }
            }
            if(hasSouthConnection) {
                for(let i = 0; i <= stepDistance; i++) {
                    const tempTile = tileGraph[tileCordX][tileCordY + i];
                    const nextTile = tileGraph[tileCordX][tileCordY + i + 1];
                    tempTile.tileType = TileType.floor;
                    tempTile.connections.push(nextTile);
                    nextTile.connections.push(tempTile);
                }
            }
        });
    });
    return tileGraph;
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
