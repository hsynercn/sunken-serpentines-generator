import { generateFontGraph } from "./Font";
import { addInnerMaze, createTileArea, generateGridGraph, generateMazeGraph, generateTileMazeWithStepDistance } from "./TileAreaGenerator";
import { renderTileGraph } from "./rendering/Render";

const sizeX = 5;
const sizeY = 7;
const connectedGraph = generateGridGraph(sizeX, sizeY, true);
const graph = generateFontGraph(connectedGraph);


const nodeDistance = 5;
const nodeDimension = 5;
const frameOffset = 5;


let tileGraph = createTileArea(nodeDimension, sizeX, nodeDistance, frameOffset, sizeY);
tileGraph = generateTileMazeWithStepDistance(graph,tileGraph,nodeDistance,nodeDimension,frameOffset);

const path = '../images/tile_image_font_' + nodeDistance + '_' + nodeDimension + '_' + sizeX + '_' + sizeY + '.png';
renderTileGraph(tileGraph, path);