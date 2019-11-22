export class Vector2D {
  constructor(public x: number, public y: number) {}
  public equals(v:Vector2D):boolean {
    return Vector2D.equals(this, v);
  }
  public clone():Vector2D {
    return Vector2D.copy(this);
  }
  public add(v: Vector2D):Vector2D {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  public as(v:Vector2D):Vector2D {
    this.x = v.x;
    this.y = v.y;
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
  get unitVector():Vector2D {
    return Vector2D.unitization(this);
  }
  public projection(v:Vector2D):number {
    return Vector2D.projection(this, v);
  }

  public vectorRotate(angle:Angle):Vector2D {
    return this.as(Vector2D.vectorRotate(this, angle));
  }
  public pointRotate(center:Vector2D, angle:Angle):Vector2D {
    return this.as(Vector2D.pointRotate(this, center, angle));
  }

  public static add(v1:Vector2D, v2:Vector2D):Vector2D {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
  }
  public static difference(v1:Vector2D, v2:Vector2D):Vector2D {
    return new Vector2D(v1.x - v2.x, v1.y - v2.y);
  }

  public static mult(v:Vector2D, n:number):Vector2D {
    return new Vector2D(v.x * n, v.y * n);
  }
  public static dot(v1:Vector2D, v2:Vector2D):number {
    return v1.x * v2.x + v1.y * v2.y;
  }
  public static radius(v:Vector2D):number {
    return Math.sqrt(Vector2D.dot(v, v));
  }
  public static unitization(v:Vector2D):Vector2D {
    if (v.equals(Vector2D.ZERO)) {
      throw new Error("cannot get unitization of zero vector");
    }
    return v.clone().mult(1 / v.radius);
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
  public static vectorRotate(v:Vector2D, angle:Angle):Vector2D {
    let a:number = angle.value;
    let cos:number = Math.cos(a),
      sin:number = Math.sin(a);
    switch (angle.special) {
      case "right-angle":
        return new Vector2D(-v.y, v.x);
      case "right-angle-reverse":
        return new Vector2D(v.y, -v.x);
      case "":
        return new Vector2D(v.x * cos - v.y * sin, v.y * cos + v.x * sin);
    }
  }
  public static pointRotate(p:Vector2D, center:Vector2D, angle:Angle):Vector2D {
    return Vector2D.difference(p, center).vectorRotate(angle).add(center);
  }
}

export class Line {
  get directionVector():Vector2D {
    return Vector2D.difference(this.p1, this.p2);
  }
  get normalVector():Vector2D {
    return this.directionVector.normalVector;
  }
  constructor(public readonly p1:Vector2D, public readonly p2:Vector2D) {
    if (p1.equals(p2)) {
      throw new Error("Points cannot be the same!");
    }
  }
  public distance(point:Vector2D):number {
    let v1:Vector2D = Vector2D.difference(point, this.p1);
    let n:Vector2D = this.normalVector;
    return Math.abs(v1.projection(n));
  }
  public clone():Line {
    return new Line(this.p1.clone(), this.p2.clone());
  }
}

export class Angle {
  constructor(public readonly special:""|"right-angle"|"right-angle-reverse", public readonly value:number) {}
  public static readonly RIGHT_ANGLE:Angle = new Angle("right-angle", Math.PI / 2);
  public static readonly RIGHT_ANGLE_REVERSE:Angle = new Angle("right-angle-reverse", 0 - Math.PI / 2);
}
