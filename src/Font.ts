import { GraphNode } from "./GraphNode";
import { replicateGridGraph } from "./TileAreaGenerator";

const symbolA = [
    " XXXX",
    "X   X",
    "X   X",
    "XXXXX",
    "X   X",
    "X   X",
    "X   X"
];

export function generateFontGraph(connectedGraph: Map<number, Map<number, GraphNode>>) {
    const maze = replicateGridGraph(connectedGraph, false);
    
    symbolA.forEach((row, y) => {
        row.split('').forEach((char, x) => {
            if(char === 'X') {
                if( x > 0 && row[x-1] === 'X') {
                    const currentRow = maze.get(y);
                    const currentNode = currentRow?.get(x);
                    const leftNode = currentRow?.get(x-1);
                    if(currentNode && leftNode) {
                        currentNode.connections.push(leftNode);
                        leftNode.connections.push(currentNode);
                    }
                }
                if( x < row.length - 1 && row[x+1] === 'X') {
                    const currentRow = maze.get(y);
                    const currentNode = currentRow?.get(x);
                    const rightNode = currentRow?.get(x+1);
                    if(currentNode && rightNode) {
                        currentNode.connections.push(rightNode);
                        rightNode.connections.push(currentNode);
                    }
                }
                if( y > 0 && symbolA[y-1][x] === 'X') {
                    const currentNode = maze.get(y)?.get(x);
                    const topNode = maze.get(y-1)?.get(x);
                    if(currentNode && topNode) {
                        currentNode.connections.push(topNode);
                        topNode.connections.push(currentNode);
                    }
                }
                if( y < symbolA.length - 1 && symbolA[y+1][x] === 'X') {
                    const currentNode = maze.get(y)?.get(x);
                    const bottomNode = maze.get(y+1)?.get(x);
                    if(currentNode && bottomNode) {
                        currentNode.connections.push(bottomNode);
                        bottomNode.connections.push(currentNode);
                    }
                }
            }
        });

    });
    
    return maze;
}