import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { TileNode, TileType } from "../TileNode";
import { GraphNode } from "../GraphNode";
import { connectGridNodes, createTileArea, generateGridGraph, generateMazeGraph, generateTileMazeWithStepDistance } from "../TileAreaGenerator";

const tileSize = 1;
const wallColor = "lightgray";
const floorColor = "black";
const nodeCenter = "blue";

export function renderNodeGraphWithSpacing(graphNodes: GraphNode [][]) {
    const canvas = createCanvas(3 * tileSize * graphNodes.length, 3 * tileSize * graphNodes[0].length);
    const ctx = canvas.getContext("2d");

    for(let x = 0; x < graphNodes.length; x++) {
        for(let y = 0; y < graphNodes[x].length; y++) {
            const tileNode = graphNodes[x][y];
            ctx.fillStyle = nodeCenter;
            ctx.fillRect((3*x + 1) * tileSize, (3*y + 1) * tileSize, tileSize, tileSize);

            ctx.fillStyle = wallColor;
            ctx.fillRect((3*x) * tileSize, (3*y) * tileSize, tileSize, tileSize);
            ctx.fillRect((3*x + 2) * tileSize, (3*y) * tileSize, tileSize, tileSize);
            ctx.fillRect((3*x) * tileSize, (3*y + 2) * tileSize, tileSize, tileSize);
            ctx.fillRect((3*x + 2) * tileSize, (3*y + 2) * tileSize, tileSize, tileSize);

            ctx.fillStyle = wallColor;
            if(tileNode.connections.find(connection => connection.x === tileNode.x - 1)) {
                ctx.fillStyle = floorColor;
            }

            ctx.fillRect((3*x) * tileSize, (3*y + 1) * tileSize, tileSize, tileSize);
            ctx.fillStyle = wallColor;
            if(tileNode.connections.find(connection => connection.x === tileNode.x + 1)) {
                ctx.fillStyle = floorColor;
            }

            ctx.fillRect((3*x + 2) * tileSize, (3*y + 1) * tileSize, tileSize, tileSize);
            ctx.fillStyle = wallColor;
            if(tileNode.connections.find(connection => connection.y === tileNode.y - 1)) {
                ctx.fillStyle = floorColor;
            }

            ctx.fillRect((3*x + 1) * tileSize, (3*y) * tileSize, tileSize, tileSize);
            ctx.fillStyle = wallColor;
            if(tileNode.connections.find(connection => connection.y === tileNode.y + 1)) {
                ctx.fillStyle = floorColor;
            }
            ctx.fillRect((3*x + 1) * tileSize, (3*y + 2) * tileSize, tileSize, tileSize);
        }
    }

    // Write the image to file
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./image.png", buffer);
}

export const renderTileGraph = (tileGraph: TileNode[][]) => {
  const canvas = createCanvas(tileSize * tileGraph.length, tileSize * tileGraph[0].length);
    const ctx = canvas.getContext("2d");
  tileGraph.forEach((column, x) => {
    column.forEach((node, y) => {

      if(node.tileType === TileType.FLOOR) {
        ctx.fillStyle = floorColor;
      } else {
        ctx.fillStyle = wallColor;
      }

      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

    });
  });
  const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./tile_image.png", buffer);
}

export const renderGraph = (maze: GraphNode[][]) => {
    const sizeY = maze[0].length;
    maze.forEach(row => {
      let rowStringTop = '';
      let rowStringMid = '';
      row.forEach(node => {
        const id = ' ';
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

const sizeX = 10;
const sizeY = 10;
const connectedGraph = generateGridGraph(sizeX, sizeY, true);
const graph = generateMazeGraph(connectedGraph);

const nodeDistance = 19;
const nodeDimension = 33;
const frameThickness = 1;

let tileGraph = createTileArea(nodeDimension, sizeX, nodeDistance, frameThickness, sizeY);

tileGraph = generateTileMazeWithStepDistance(graph,tileGraph,nodeDistance,nodeDimension,frameThickness);

const innerNodeDistance = 1;
const innerNodeDimension = 1;
const innerFrameThickness = 0;

//const tileSizeX = nodeDimension * sizeX + (sizeX - 1) * nodeDistance;
//const tileSizeY = nodeDimension * sizeY + (sizeY - 1) * nodeDistance;

let x = 0;
let y = 0;

const startOffset = frameThickness;
let tileLeftTopCordX = startOffset + innerNodeDimension * x + innerNodeDistance * x;
let tileLeftTopCordY = startOffset + innerNodeDimension * y + innerNodeDistance * y;

const newSkeletonGraphConnected: Map<number,Map<number,GraphNode>> = new Map();

while((tileLeftTopCordX + innerNodeDimension) <= tileGraph.length) {
  newSkeletonGraphConnected.set(x,new Map());
  while((tileLeftTopCordY + innerNodeDimension) <= tileGraph[0].length) {
    
    //add a node to new graph skeleton
    if(tileGraph[tileLeftTopCordX][tileLeftTopCordY].tileType === TileType.FLOOR) {
      newSkeletonGraphConnected.get(x)?.set(y,new GraphNode(x,y));
    }
    y++;
    tileLeftTopCordY = frameThickness + innerNodeDimension * y + innerNodeDistance * y;
  }
  x++;
  tileLeftTopCordX = frameThickness + innerNodeDimension * x + innerNodeDistance * x;
  y = 0;
  tileLeftTopCordY = frameThickness + innerNodeDimension * y + innerNodeDistance * y;
}

connectGridNodes(newSkeletonGraphConnected);

let tileGraph2 = createTileArea(nodeDimension, sizeX, nodeDistance, frameThickness, sizeY);
const newSkeletonGraph = generateMazeGraph(newSkeletonGraphConnected);
tileGraph2 = generateTileMazeWithStepDistance(newSkeletonGraph,tileGraph2,innerNodeDistance,innerNodeDimension,frameThickness);

renderTileGraph(tileGraph2);

//const area = generateMaze(10, 10);
//printMaze(area);