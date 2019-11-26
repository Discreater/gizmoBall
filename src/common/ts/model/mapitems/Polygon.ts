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

export class PolygonCollider extends Collider {
  public zoomTo(zoomCenter: Vector2D, zoom: number): IZoomable {
    if (zoom !== this._zoom) {
      this._vertexes.forEach(value =>
        value.add(
          Vector2D.difference(value, zoomCenter).mult(zoom - this._zoom)
        )
      );
    }
    this._zoom = zoom;
    return this;
  }

  public rotate(center: Vector2D, angle: Angle): IRotatable {
    this._vertexes.forEach(value => value.pointRotate(center, angle));
    switch (angle.special) {
      case "right-angle":
        this._rotation = (this._rotation - 1 + 4) % 4;
        break;
      case "right-angle-reverse":
        this._rotation = (this._rotation + 1) % 4;
        break;
      case "":
        break;
    }
    return this;
  }

  public get center(): Vector2D {
    return this.position.add(MapItem.vertical.clone().add(MapItem.horizontal).mult(0.5 * this.zoom));
  };

  public translate(point: Vector2D): ITransmittable {
    this._vertexes.forEach(value =>
      value.add(Vector2D.difference(point, this._position))
    );
    this._position = point.clone();
    return this;
  }

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
        let result:boolean = !this.separationOnAxes(axes, crashable);
        if (result) {
          console.log(this);
          console.log("crashes");
          console.log(crashable);
        }
        return result;
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
    circle: CircleCollider
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

  public crashHandle(crashable: ICollisible): void {
    if (crashable instanceof Ball) {
      let closestLine: Line = this._edges[0];
      let ballPos:Vector2D = crashable.massPoint.p;
      let closestDistance: number = this._edges[0].distance(ballPos);
      this._edges.forEach(value => {
        let thisDistance:number = value.distance(ballPos);
        if (closestDistance > thisDistance) {
          closestDistance = thisDistance;
          closestLine = value;
        }
      });
      crashable.massPoint.setVelocity(crashable.massPoint.v.reflet(closestLine.normalVector));
    }
  }
}

export abstract class PolygonMapItem extends MapItem implements IRotatable, IZoomable {
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
  rotate(center: Vector2D, angle:Angle): IRotatable {
    this.collider.rotate(center, angle);
    return this;
  }
  public get center():Vector2D {
    return this.collider.center;
  }
}
