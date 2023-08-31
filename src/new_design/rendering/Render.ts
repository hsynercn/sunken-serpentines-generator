import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { TileNode, TileType } from "../TileNode";
import { generateEmptyGraph, generateMazeGraph, generateTileMazeWithStepDistance } from "../TileAreaGenerator";
import { GraphNode } from "../GraphNode";

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

//const area = generateEmptyMazeGraph(2000, 2000);
//const area = generateMazeGraph(100, 100);
//renderNodeGraphWithSpacing(area);
//sizeX: number, sizeY: number, nodeDistance: number, nodeDimension: number = 1, frameThickness: number = 1
const tileGraph = generateTileMazeWithStepDistance(3,3,3,2,1);
renderTileGraph(tileGraph);

//const area = generateMaze(10, 10);
//printMaze(area);