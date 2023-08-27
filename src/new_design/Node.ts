export class Node {
  public x: number;
  public y: number;
  public connections: Node[];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.connections = [];
  }
}
