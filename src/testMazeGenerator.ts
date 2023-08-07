import { generateMaze, printMaze } from './util/graphMaze';

const sizeX = 3;
const sizeY = 3;
const maze = generateMaze(sizeX, sizeY);

console.log('****************************************************************');

printMaze(maze, false);
printMaze(maze, true);
