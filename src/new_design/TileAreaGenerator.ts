import { LcgGenerator } from "./LcgGenerator";
import { TileNode, TileType } from "./TileNode";

export type NewConnection = {
    node: TileNode;
    previousNode: TileNode;
};

export function generateEmptyMazeGraph(
    sizeX: number,
    sizeY: number
): TileNode[][] {
    const maze: TileNode[][] = [];
    for (let x = 0; x < sizeX; x++) {
        maze[x] = [];
        for (let y = 0; y < sizeY; y++) {
            maze[x][y] = new TileNode(x, y, TileType.floor);
        }
    }
    return maze;
}

//export const generator = new LcgGenerator(3819201);

export function generateMaze(sizeX: number, sizeY: number) {
    const maze = generateEmptyMazeGraph(sizeX, sizeY);
    const lcgGenerator = new LcgGenerator(3819201);

    const visitedNodes: Set<TileNode> = new Set<TileNode>();

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

            let unvisitedConNodes: TileNode[] = [];
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
