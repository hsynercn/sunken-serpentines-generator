export class GraphNode {
  public x: number;
  public y: number;
  public connections: GraphNode[];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.connections = [];
  }
}
