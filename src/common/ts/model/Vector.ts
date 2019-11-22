export class Vector2D {
  constructor(public x: number, public y: number) {}
  public equals(v:Vector2D):boolean {
    return Vector2D.equals(this, v);
  }
  public add(v: Vector2D):Vector2D {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  public mult(n: number):Vector2D {
    this.x *= n;
    this.y *= n;
    return this;
  }
  public dot(v:Vector2D):number {
    return Vector2D.dot(this, v);
  }
  get radius():number {
    return Vector2D.radius(this);
  }
  get normalVector():Vector2D {
    return Vector2D.normalVector(this);
  }
  public projection(v:Vector2D):number {
    return Vector2D.projection(this, v);
  }

  public static add(v1:Vector2D, v2:Vector2D):Vector2D {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
  }

  public static mult(v:Vector2D, n:number):Vector2D {
    return new Vector2D(v.x * n, v.y * n);
  }
  public static dot(v1:Vector2D, v2:Vector2D):number {
    return v1.x * v2.x + v1.y * v2.y;
  }
  public static radius(v:Vector2D):number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }
  public static projection(v1:Vector2D, v2:Vector2D):number {
    return Vector2D.dot(v1, v2) / v2.radius;
  }
  public static angle(v1:Vector2D, v2:Vector2D):number {
    return Math.acos(Vector2D.dot(v1, v2) / (v1.radius * v2.radius));
  }
  public static copy(v:Vector2D):Vector2D {
    return new Vector2D(v.x, v.y);
  }
  public static readonly ZERO:Vector2D = new Vector2D(0, 0);
  public static equals(v1:Vector2D, v2:Vector2D):boolean {
    return v1.x === v2.x && v1.y === v2.y;
  }
  public static normalVector(v:Vector2D):Vector2D {
    return new Vector2D(v.y, -v.x);
  }
}
