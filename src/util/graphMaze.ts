import { Singleton } from './lcgGenerator';

export type NewConnection = {
  node: MazeNode;
  previousNode: MazeNode;
};

export class MazeNode {
  public x: number;
  public y: number;
  public visited: boolean;
  public connections: MazeNode[];
  public readonly id: string;

  constructor(x: number, y: number, id: string) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.connections = [];
    this.id = id;
  }
}

function generateEmptyMazeGraph(sizeX: number, sizeY: number): MazeNode[][] {
  const maze: MazeNode[][] = [];
  for (let x = 0; x < sizeX; x++) {
    maze[x] = [];
    for (let y = 0; y < sizeY; y++) {
      maze[x][y] = new MazeNode(x, y, Singleton.randomAlphaNumericChar());
    }
  }
  return maze;
}

export function generateMaze(sizeX: number, sizeY: number) {
  const maze = generateEmptyMazeGraph(sizeX, sizeY);

  const randomStartPointX = Singleton.generator.next() % sizeX;
  const randomStartPointY = Singleton.generator.next() % sizeY;

  const nodeStack: NewConnection[] = [];

  const startNode = maze[randomStartPointX][randomStartPointY];

  const start: NewConnection = {
    node: startNode,
    previousNode: startNode
  };

  nodeStack.push(start);

  while (nodeStack.length > 0) {
    const currentMazeNode = nodeStack.pop();
    const node = currentMazeNode?.node as MazeNode;
    const previousNode = currentMazeNode?.previousNode as MazeNode;
    if (node.visited === false) {
      if (node !== previousNode) {
        node.connections.push(previousNode);
        previousNode.connections.push(node);
      }

      node.visited = true;

      let unvisitedConNodes: MazeNode[] = [];
      if (maze?.[node.x - 1]?.[node.y] && !maze[node.x - 1][node.y].visited) {
        unvisitedConNodes.push(maze[node.x - 1][node.y]);
      }
      if (maze?.[node.x + 1]?.[node.y] && !maze[node.x + 1][node.y].visited) {
        unvisitedConNodes.push(maze[node.x + 1][node.y]);
      }
      if (maze?.[node.x]?.[node.y - 1] && !maze[node.x][node.y - 1].visited) {
        unvisitedConNodes.push(maze[node.x][node.y - 1]);
      }
      if (maze?.[node.x]?.[node.y + 1] && !maze[node.x][node.y + 1].visited) {
        unvisitedConNodes.push(maze[node.x][node.y + 1]);
      }
      if (unvisitedConNodes.length > 0) {
        while (unvisitedConNodes.length > 0) {
          const randomIndex =
            Math.ceil(Singleton.generator.next() / 10000) %
            unvisitedConNodes.length;
          const randomNode = unvisitedConNodes[randomIndex];
          const stackNode: NewConnection = {
            node: randomNode,
            previousNode: node
          };
          nodeStack.push(stackNode);
          unvisitedConNodes = unvisitedConNodes.filter(
            node => node !== randomNode
          );
        }
      }
    }
  }
  return maze;
}

export const printMaze = (maze: MazeNode[][], printNode: boolean) => {
  const sizeY = maze[0].length;
  maze.forEach(row => {
    let rowStringTop = '';
    let rowStringMid = '';
    row.forEach(node => {
      const id = printNode ? node.id : ' ';
      const upConnection = node.connections.find(
        connection => connection.x === node.x - 1
      );
      const leftConnection = node.connections.find(
        connection => connection.y === node.y - 1
      );
      if (!upConnection) {
        rowStringTop += '+--';
      } else {
        rowStringTop += `+${id} `;
      }
      if (!leftConnection) {
        rowStringMid += `|${id} `;
      } else {
        rowStringMid += ` ${id} `;
      }
    });
    rowStringTop += '+';
    rowStringMid += '|';
    console.log(rowStringTop);
    console.log(rowStringMid);
  });
  console.log('+--'.repeat(sizeY) + '+');
};
