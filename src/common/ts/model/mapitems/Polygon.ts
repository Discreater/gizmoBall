import {
  ICollisible,
  IZoomable,
  IRotatable,
  ITransmittable,
  Direction,
  MapItem
} from "./MapItem";
import { Vector2D, Angle, Line } from "../../util/Vector";
import { CircleCollider } from "./Circle";
import { Ball } from "./Ball";
import { Collider } from './Collider';
import { Physical } from '../Physical';

export class PolygonCollider extends Collider {

  protected _edges: Line[];

  /**
   * 多边形的边，返回拷贝
   */
  public get edges(): Line[] {
    return this._edges.map(item => item.clone());
  }

  /**
   * 多边形的顶点，返回拷贝
   */
  public get vertexes(): Vector2D[] {
    return this._vertexes.map(item => item.clone());
  }

  public get center(): Vector2D {
    return this.position.add(MapItem.vertical.clone().add(MapItem.horizontal).mult(0.5 * this.zoom));
  };

  constructor(
    // 核心属性，顶点与边相绑定
    protected _vertexes: Vector2D[],
    // 校准点位置
    protected _position: Vector2D = Vector2D.ZERO
  ) {
    super();
    this._edges = this._vertexes.map(
      (item, index, array) => new Line(item, array[(index + 1) % array.length])
    );
  }

  public zoomTo(zoomCenter: Vector2D, zoom: number): IZoomable {
    if (zoom !== this._zoom) {
      this._vertexes.forEach(value =>
        value.as(Vector2D.add(
          zoomCenter,
          Vector2D.difference(value, zoomCenter).mult(zoom / this._zoom)
        ))
      );
    }
    this._zoom = zoom;
    return this;
  }

  public rotate(center: Vector2D, angle: Angle): IRotatable {
    this._vertexes.forEach(value => value.pointRotate(center, angle));
    switch (angle.special) {
      case "right-angle-reverse":
        this._rotation = (this._rotation - 1 + 4) % 4;
        break;
      case "right-angle":
        this._rotation = (this._rotation + 1) % 4;
        break;
      case "":
        break;
    }
    return this;
  }

  public translate(point: Vector2D): ITransmittable {
    this._vertexes.forEach(value =>
      value.add(Vector2D.difference(point, this._position))
    );
    this._position = point.clone();
    return this;
  }


  public crashDetect(crashable: ICollisible): boolean {
    if (crashable instanceof PolygonCollider) {
      let edges:Line[] = crashable.edges;
      let axes: Vector2D[] = [];
      for (let edge of edges) {
        axes.push(edge.normalVector);
      }
      if (axes.length === 0) {
        return PolygonCollider.polygonCollidesWithCircle(this, crashable);
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
    if (polygon instanceof PolygonCollider && circle instanceof CircleCollider) {
      let closestPoint:Vector2D = PolygonCollider.getPolygonPointClosestToCircle(
        polygon,
        circle
      );
      let edges:Line[] = polygon.edges;
      let axes: Vector2D[] = [];
      if (closestPoint !== undefined) {
        for (let edge of edges) {
          axes.push(edge.normalVector);
        }
        axes.push(Vector2D.difference(closestPoint, circle.center));
        return !polygon.separationOnAxes(axes, circle);
      }
    }
    return false;
  }

  public separationOnAxes(axes: Vector2D[], crashable: PolygonCollider): boolean {
    for (let i of axes) {
      let projection1:Vector2D = this.project(i);
      let projection2:Vector2D = crashable.project(i);
      if (!(projection1.y > projection2.x && projection2.y > projection1.x)) {
        return true;
      }
    }
    return false;
  }

  public project(axis: Vector2D): Vector2D {
    let scalars: number[] = [];
    let v:Vector2D = new Vector2D(0, 0);
    this.vertexes.forEach((point) => {
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
    polygon: PolygonCollider,
    circle: CircleCollider | Ball
  ):Vector2D {
    let min:number = 100000;
    let vertexes:Vector2D[] = polygon.vertexes;
    let closestPoint:Vector2D = vertexes[0];
    for (let point of vertexes) {
      let length:number = Vector2D.difference(circle.center, point).radius;
      if (min > length) {
        min = length;
        closestPoint = point;
      }
    }
    return closestPoint;
  }

  public static outPointProjectionOnEdge(edge:Line, point:Vector2D):boolean {
    const v1:Vector2D = Vector2D.difference(point, edge.p1),
      v2:Vector2D = Vector2D.difference(point, edge.p2),
      axis:Vector2D = edge.normalVector;
    if (v1.dot(axis) <= 0 || v2.dot(axis) <= 0) {
      // 点不在法向量一侧
      return false;
    } else {
      const borderAxis1:Vector2D = Vector2D.difference(edge.p2, edge.p1),
        borderAxis2:Vector2D = Vector2D.negate(borderAxis1);
      // 判断点是否在两条直线中间
      return borderAxis1.dot(v1) >= 0 && borderAxis2.dot(v2) >= 0;
    }
  }

  public crashHandle(crashable: ICollisible): void {
    if (crashable instanceof Ball) {
      let refletLine: Line | null = null;
      let ballPos:Vector2D = crashable.massPoint.p.add(crashable.massPoint.v.mult(-Physical.tick));
      for (let value of this._edges) {
        if (refletLine === null) {
          if (PolygonCollider.outPointProjectionOnEdge(value, ballPos)) {
            refletLine = value;
            break;
          }
        }
      }
      if (refletLine !== null) {
        const axis:Vector2D = refletLine.normalVector;
        Physical.surfaceVelocityReflect(crashable.massPoint, axis);
      } else {
        const closestPoint:Vector2D = PolygonCollider.getPolygonPointClosestToCircle(this, crashable);
        Physical.surfaceVelocityReflect(crashable.massPoint, Vector2D.difference(crashable.center, closestPoint));
      }
    }
  }
}

export abstract class PolygonMapItem extends MapItem implements IRotatable, IZoomable {
  constructor(protected collider:PolygonCollider) {
    super(collider);
  }
  get zoom(): number {
    return this.collider.zoom;
  }
  zoomTo(zoomCenter: Vector2D, zoom: number): IZoomable {
    this.collider.zoomTo(zoomCenter, zoom);
    return this;
  }
  get rotation():Direction {
    return this.collider.rotation;
  }
  set rotation(rotation:Direction) {
    this.collider.rotation = rotation;
  }
  rotate(center: Vector2D, angle:Angle): IRotatable {
    this.collider.rotate(center, angle);
    return this;
  }
  public get center():Vector2D {
    return this.collider.center;
  }
}
