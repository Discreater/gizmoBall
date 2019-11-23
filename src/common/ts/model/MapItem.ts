import { MassPoint } from "./Physical";
import { Vector2D, Line, Angle } from "./Vector";
import { Ball } from "./Ball";
import { createStyleSheet } from "../titleBar/common/dom";

export enum Direction {
  Up,
  Right,
  Down,
  Left
}
export interface IRotatable {
  rotation: Direction;
  rotate(center: Vector2D, angle: Angle): IRotatable;
}

export interface ICollisible {
  crashDetect(crashable: ICollisible): boolean;
  crashHandle(crashable: ICollisible): void;
}

export interface IZoomable {
  zoom: number;
  zoomTo(zoomCenter: Vector2D, zoom: number): IZoomable;
}

export interface ITransmittable {
  position: Vector2D;
  center: Vector2D;
  translate(point: Vector2D): ITransmittable;
}

export abstract class MapItem implements ICollisible {
  public abstract crashDetect(crashable: ICollisible): boolean;
  public abstract crashHandle(crashable: ICollisible): void;
  public static readonly gridScale: number = 36;
  private _position: Vector2D;
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

export abstract class Polygon
  implements ICollisible, IZoomable, IRotatable, ITransmittable {
  public get zoom(): number {
    return this._zoom;
  }
  public set zoom(zoom: number) {
    this.zoomTo(this.position, zoom);
  }
  public zoomTo(zoomCenter: Vector2D, zoom: number): IZoomable {
    if (zoom !== this._zoom) {
      // 放缩操作
      this._vertexes.forEach(value =>
        value.add(
          Vector2D.difference(value, zoomCenter).mult(zoom - this._zoom)
        )
      );
    }
    this._zoom = zoom;
    return this;
  }
  public get rotation(): Direction {
    return this._rotation;
  }
  public set rotation(rotation: Direction) {
    let times: number = (this._rotation - rotation + 4) % 4;
    for (let i: number = 0; i < times; i++) {
      this.rotate(this.position, Angle.RIGHT_ANGLE_REVERSE);
    }
    this._rotation = rotation;
  }
  public rotate(center: Vector2D, angle: Angle): IRotatable {
    this._vertexes.forEach(value => value.pointRotate(center, angle));
    return this;
  }
  public get position(): Vector2D {
    return this._position.clone();
  }
  public set position(position: Vector2D) {
    this.translate(position);
  }
  public get center(): Vector2D {
    let vs: Vector2D[] = this.vertexes;
    let v1: Vector2D = vs[0],
      v2: Vector2D = vs[2];
    return v1.add(v2).mult(0.5);
  }
  public translate(point: Vector2D): ITransmittable {
    this._vertexes.forEach(value =>
      value.add(Vector2D.difference(point, this._position))
    );
    this._position = point.clone();
    return this;
  }
  protected _edges: Line[];
  public get edges(): Line[] {
    return this._edges.map(item => item.clone());
  }
  public get vertexes(): Vector2D[] {
    return this._vertexes.map(item => item.clone());
  }
  constructor(
    // 核心属性，顶点与边相绑定
    protected _vertexes: Vector2D[],
    // 校准点位置
    protected _position: Vector2D = Vector2D.ZERO,
    protected _rotation: Direction = Direction.Up,
    protected _zoom: number = 1
  ) {
    this._edges = this._vertexes.map(
      (item, index, array) => new Line(item, array[(index + 1) % array.length])
    );
  }
  public crashDetect(crashable: ICollisible): boolean {
    if (crashable instanceof Polygon) {
      let edges = crashable.edges;
      let axes: Vector2D[] = [];
      for (let edge of edges) {
        axes.push(edge.normalVector);
      }
      if (axes.length === 0) {
        return Polygon.polygonCollidesWithCircle(this, crashable);
      } else {
        for (let edge of this.edges) {
          axes.push(edge.normalVector);
        }
        return !this.separationOnAxes(axes, crashable);
      }
    }
    return false;
  }
  public static polygonCollidesWithCircle(
    polygon: ICollisible,
    circle: ICollisible
  ): boolean {
    if (polygon instanceof Polygon && circle instanceof Polygon) {
      let closestPoint = Polygon.getPolygonPointClosestToCircle(
        polygon,
        circle
      );
      let edges = polygon.edges;
      let axes: Vector2D[] = [];
      if (closestPoint != undefined) {
        for (let edge of edges) {
          axes.push(edge.normalVector);
        }
        axes.push(
          new Vector2D(
            closestPoint.x - circle.center.x,
            closestPoint.y - circle.center.y
          )
        );
        return !polygon.separationOnAxes(axes, circle);
      }
    }
    return false;
  }
  public separationOnAxes(axes: Vector2D[], crashable: Polygon): boolean {
    for (let i of axes) {
      let projection1 = this.project(i);
      let projection2 = crashable.project(i);
      if (!(projection1.y > projection2.x && projection2.y > projection1.x)) {
        return true;
      }
    }
    return false;
  }
  public project(axis: Vector2D): Vector2D {
    let scalars: number[] = [];
    let v = new Vector2D(0, 0);
    this.vertexes.forEach(function(point) {
      v.x = point.x;
      v.y = point.y;
      scalars.push(v.projection(axis));
    });
    return new Vector2D(
      Math.min.apply(Math, scalars),
      Math.max.apply(Math, scalars)
    );
  }
  public static getPolygonPointClosestToCircle(
    polygon: Polygon,
    circle: Polygon
  ) {
    let min = 100000;
    let closestPoint;
    for (let point of polygon.vertexes) {
      let length = Math.sqrt(
        Math.pow(circle.center.x - point.x, 2) +
          Math.pow(circle.center.y - point.y, 2)
      );
      if (min > length) {
        min = length;
        closestPoint = point;
      }
    }
    return closestPoint;
  }
  public crashHandle(crashable: ICollisible): void {
    if (crashable instanceof Ball) {
      let closestLine: Line = this._edges[0];
      let ballPos = crashable.massPoint.p;
      let closestDistance: number = this._edges[0].distance(ballPos);
      this._edges.forEach(value => {
        let thisDistance = value.distance(ballPos);
        if (closestDistance > thisDistance) {
          closestDistance = thisDistance;
          closestLine = value;
        }
      });
      crashable.massPoint.addVelocity(
        crashable.massPoint.v.component(closestLine.normalVector).mult(-2)
      );
    }
  }
}

export class Square extends Polygon {
  public static readonly vertical: Vector2D = new Vector2D(
    0,
    MapItem.gridScale
  );
  public static readonly horizontal: Vector2D = new Vector2D(
    MapItem.gridScale,
    0
  );
  constructor(position: Vector2D) {
    super(
      [
        position.clone(),
        position.clone().add(Square.vertical),
        position
          .clone()
          .add(Square.horizontal)
          .add(Square.vertical),
        position.clone().add(Square.horizontal)
      ],
      position
    );
  }
}

export class Triangle extends Polygon {
  constructor(position: Vector2D) {
    super(
      [
        position.clone(),
        position.clone().add(Square.vertical),
        position
          .clone()
          .add(Square.horizontal)
          .add(Square.vertical)
      ],
      position
    );
  }
}
