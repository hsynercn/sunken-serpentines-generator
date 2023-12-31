import { addInnerMaze, createTileArea, generateGridGraph, generateMazeGraph, generateTileMazeWithStepDistance } from "./TileAreaGenerator";
import { renderTileGraph } from "./rendering/Render";

const sizeX = 9;
const sizeY = 16;
const connectedGraph = generateGridGraph(sizeX, sizeY, true);
const graph = generateMazeGraph(connectedGraph);


const nodeDistance =81;
const nodeDimension = 81;
const frameOffset = 25;


let tileGraph = createTileArea(nodeDimension, sizeX, nodeDistance, frameOffset, sizeY);
tileGraph = generateTileMazeWithStepDistance(graph,tileGraph,nodeDistance,nodeDimension,frameOffset);


//tileGraph = addInnerMaze(tileGraph, 243, 243, frameOffset);
//tileGraph = addInnerMaze(tileGraph, 81, 81, frameOffset);
//tileGraph = addInnerMaze(tileGraph, 27, 27, frameOffset);
tileGraph = addInnerMaze(tileGraph, 9, 9, frameOffset);
//tileGraph = addInnerMaze(tileGraph, 3, 3, frameOffset);
//tileGraph = addInnerMaze(tileGraph, 1, 1, frameOffset);

const path = '../images/tile_image_' + nodeDistance + '_' + nodeDimension + '_' + sizeX + '_' + sizeY + '.png';
renderTileGraph(tileGraph, path);