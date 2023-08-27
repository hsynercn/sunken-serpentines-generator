import { Tile } from "./Tile";
import { Node } from "./Node";

export class TileNode extends Node {
  public readonly tileType: TileType;

  constructor(x: number, y: number, tileType: TileType) {
    super(x, y);
    this.tileType = tileType;
  }
}

export enum TileType {
  wall = "wall",
  floor = "floor",
}