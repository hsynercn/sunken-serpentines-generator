import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { TileNode } from "../TileNode";
import { generateEmptyMazeGraph, generateMaze } from "../TileAreaGenerator";

export function renderTileGraph(tileNodes: TileNode [][]) {
    const tileSize = 1;
    const canvas = createCanvas(tileSize * tileNodes.length, tileSize * tileNodes[0].length);
    const ctx = canvas.getContext("2d");

    for(let x = 0; x < tileNodes.length; x++) {
        for(let y = 0; y < tileNodes[x].length; y++) {
            const tileNode = tileNodes[x][y];
            if(tileNode.tileType === "wall") {
                ctx.fillStyle = "black";
            } else {
                ctx.fillStyle = "lightgray";
            }
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    // Write the image to file
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./image.png", buffer);
}

export const printMaze = (maze: TileNode[][]) => {
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
//const area = generateMaze(10, 10);
//renderTileGraph(area);

const area = generateMaze(10, 10);
printMaze(area);