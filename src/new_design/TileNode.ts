import { Tile } from "./Tile";
import { GraphNode } from "./Node";

export class TileNode extends GraphNode {
  public tileType: TileType;

  constructor(x: number, y: number, tileType: TileType) {
    super(x, y);
    this.tileType = tileType;
  }
}

export enum TileType {
  wall = "wall",
  floor = "floor",
}