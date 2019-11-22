import { Vector2D } from "./Vector";

export class Physical {
  public static readonly gravity:Vector2D = new Vector2D(0, 9.8);
  public static readonly tick:number = 0.01;
}

export class MassPoint {
  private _p: Vector2D;
  private _v: Vector2D;
  private _a: Vector2D;
  constructor() {
    this._a = new Vector2D(0, 0);
    this._v = new Vector2D(0, 0);
    this._p = new Vector2D(0, 0);
  }
  get p():Vector2D {
    return Vector2D.copy(this._p);
  }
  get v():Vector2D {
    return Vector2D.copy(this._v);
  }
  get a():Vector2D {
    return Vector2D.copy(this._a);
  }
  public tick():void {
    this.changeVelocity();
    this.move();
  }

  public translate(p: Vector2D):MassPoint {
    this._p = p;
    return this;
  }
  public move(t: number = Physical.tick):MassPoint {
    this._p.add(Vector2D.mult(this._v, t));
    return this;
  }
  public changeVelocity(t: number = Physical.tick):MassPoint {
    this._v.add(Vector2D.mult(this._a, t));
    return this;
  }
  public addVelocity(v: Vector2D):MassPoint {
    this._v.add(v);
    return this;
  }
  public addAcceleration(a: Vector2D):MassPoint {
    this._a.add(a);
    return this;
  }
}
