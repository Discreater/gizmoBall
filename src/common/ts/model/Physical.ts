import { Vector2D } from "../util/Vector";

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

  /**
   * 质点传送
   * @param p 目标位置
   */
  public translate(p: Vector2D):MassPoint {
    this._p = p.clone();
    return this;
  }

  /**
   * 匀速移动
   * @param t 极短时间
   */
  public move(t: number = Physical.tick):MassPoint {
    this._p.add(Vector2D.mult(this._v, t));
    return this;
  }

  /**
   * 按时间改变速度
   * @param t 极短的时间
   */
  public changeVelocity(t: number = Physical.tick):MassPoint {
    this._v.add(Vector2D.mult(this._a, t));
    return this;
  }

  /**
   * 设置速度
   * @param v 速度
   */
  public setVelocity(v:Vector2D):MassPoint {
    this._v.as(v);
    return this;
  }

  /**
   * 增加速度
   * @param v 速度变化量
   */
  public addVelocity(v: Vector2D):MassPoint {
    this._v.add(v);
    return this;
  }

  /**
   * 增加加速度
   * @param a 加速度
   */
  public addAcceleration(a: Vector2D):MassPoint {
    this._a.add(a);
    return this;
  }

  /**
   * 设置加速度
   * @param a 加速度
   */
  public setAcceleration(a: Vector2D):MassPoint {
    this._a.as(a);
    return this;
  }
}
