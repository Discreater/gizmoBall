import { MassPoint } from "./Physical";
import { Vector2D, Line, Angle } from "./Vector";
import { Ball } from "./Ball";

export enum Direction {
  Up, Right, Down, Left
}
export interface IRotatable {
  rotation: Direction;
  rotate(center:Vector2D, angle:Angle):IRotatable;
}

export interface ICollisible {
  crashDetect(crashable:ICollisible):boolean;
  crashHandle(crashable: ICollisible):void;
}

export interface IZoomable {
  zoom:number;
  zoomTo(zoomCenter:Vector2D, zoom:number):IZoomable;
}

export interface ITransmittable {
  position: Vector2D;
  translate(point:Vector2D):ITransmittable;
}

export abstract class MapItem implements ICollisible {
  public abstract crashDetect(crashable: ICollisible):boolean;
  public abstract crashHandle(crashable: ICollisible):void;
  public static readonly gridScale:number = 36;
  private _position:Vector2D;
  get imgURL(): string {
    return "";
  }
  constructor(x: number, y: number, public zoom: number = 1) {
    this._position = new Vector2D(x, y);
  }
  public get position(): Vector2D {
    return this._position;
  }

  public set position(position: Vector2D) {
    this._position = position;
  }
}

export abstract class Polygon implements ICollisible, IZoomable, IRotatable, ITransmittable {
  public get zoom():number {
    return this._zoom;
  }
  public set zoom(zoom:number) {
    this.zoomTo(this.position, zoom);
  }
  public zoomTo(zoomCenter:Vector2D, zoom:number):IZoomable {
    if (zoom !== this._zoom) {
      // 放缩操作
      this._vertexes.forEach((value) =>
        value.add(
          Vector2D.difference(value, zoomCenter)
            .mult(zoom - this._zoom))
      );
    }
    this._zoom = zoom;
    return this;
  }
  public get rotation():Direction {
    return this._rotation;
  }
  public set rotation(rotation:Direction) {
    let times:number = (this._rotation - rotation + 4) % 4;
    for (let i:number = 0; i < times; i++) {
      this.rotate(this.position, Angle.RIGHT_ANGLE_REVERSE);
    }
    this._rotation = rotation;
  }
  public rotate(center:Vector2D, angle:Angle):IRotatable {
    this._vertexes.forEach((value) => value.pointRotate(center, angle));
    return this;
  }
  public get position():Vector2D {
    return this._position.clone();
  }
  public set position(position:Vector2D) {
    this.translate(position);
  }
  public translate(point:Vector2D):ITransmittable {
    this._vertexes.forEach((value) => value.add(Vector2D.difference(point, this._position)));
    this._position = point.clone();
    return this;
  }
  protected _edges:Line[];
  public get edges():Line[] {
    return this._edges.map((item) => item.clone());
  }
  public get vertexes():Vector2D[] {
    return this._vertexes.map((item) => item.clone());
  }
  constructor(
    // 核心属性，顶点与边相绑定
    protected _vertexes:Vector2D[],
    // 校准点位置
    protected _position:Vector2D = Vector2D.ZERO,
    protected _rotation:Direction = Direction.Up,
    protected _zoom:number = 1
  ) {
    this._edges = this._vertexes.map((item, index, array) => new Line(item, array[(index + 1) % array.length]));
  }
  public crashDetect(crashable: ICollisible):boolean {
    return false;
  }
  public crashHandle(crashable: ICollisible):void {
    // todo
  }
}

export class Square extends Polygon {
}

export class Triangle extends Polygon {
}
