export class Vector2D {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(vec: Vector2D): Vector2D {
    return new Vector2D(this.x + vec.x, this.y + vec.y);
  }

  public rotate(angle: number): Vector2D {
    const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    return new Vector2D(x, y);
  }
}

