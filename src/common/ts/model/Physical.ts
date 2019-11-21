export interface Position {
  x:number;
  y:number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Acceleration {
  ax: number;
  ay: number;
}

export class Physical {
  public static readonly gravity:Acceleration = { ax: 0, ay: 9.8 };
  public static readonly tick:number = 0.01;
}

class MassPoint {
  private _p: Position;
  private _v: Velocity;
  private _a: Acceleration;
  constructor() {
    this._a = { ax: 0, ay: 0 };
    this._v = { vx: 0, vy: 0 };
    this._p = { x: 0, y: 0 };
  }
  get p():Position {
    return { x: this._p.x, y: this._p.y };
  }
  get v():Velocity {
    return { vx: this._v.vx, vy: this._v.vy };
  }
  get a():Acceleration {
    return { ax: this._a.ax, ay: this._a.ay };
  }
  public tick():void {
    this.changeVelocity();
    this.move();
  }

  public translate(p: Position) {
    this._p = p;
  }
  public move(t: number = Physical.tick) {
    this._p.x += this._v.vx * t;
    this._p.y += this._v.vy * t;
  }
  public changeVelocity(t: number = Physical.tick) {
    this._v.vx += this._a.ax * t;
    this._v.vy += this._a.ay * t;
  }
  public addVelocity(v: Velocity) {
    this._v.vx += v.vx;
    this._v.vy += v.vy;
  }
  public addAcceleration(a: Acceleration) {
    this._a.ax += a.ax;
    this._a.ay += a.ay;
  }
}
