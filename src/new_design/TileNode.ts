import { GraphNode } from "./GraphNode";

export class TileNode extends GraphNode {
  public tileType: TileType;

  constructor(x: number, y: number, tileType: TileType) {
    super(x, y);
    this.tileType = tileType;
  }
}

export enum TileType {
  WALL = "wall",
  FLOOR = "floor",
}