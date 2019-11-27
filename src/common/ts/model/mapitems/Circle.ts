import {
  ICollisible,
  MapItem,
  MapItemNames
} from "./MapItem";
import { Vector2D, Line } from "../../util/Vector";
import { Ball } from "./Ball";
import { PolygonMapItem, PolygonCollider } from './Polygon';
import { Physical } from '../Physical';

export class CircleCollider extends PolygonCollider {
  constructor(position:Vector2D, protected _radius:number) {
    super([], position.clone());
  }

  /**
   * 半径
   */
  get radius():number {
    return this.zoom * this._radius;
  }

  /**
   * 圆心
   */
  get center():Vector2D {
    return this.position.add(new Vector2D(this.radius, this.radius));
  }

  public project(axis:Vector2D):Vector2D {
    let scalars:number[] = [];
    let point:Vector2D = this.center;
    let dotProduct:number = point.projection(axis);
    scalars.push(dotProduct);
    scalars.push(dotProduct - this.radius);
    scalars.push(dotProduct + this.radius);
    return new Vector2D(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
  }

  public crashDetect(crashable: ICollisible): boolean {
    if (crashable instanceof PolygonCollider) {
      let edges:Line[] = crashable.edges;
      let axes: Vector2D[] = [];
      for (let edge of edges) {
        axes.push(edge.normalVector);
      }
      if (axes.length === 0 && crashable instanceof CircleCollider) {
        const distance:number = Vector2D.difference(this.center, crashable.center).radius;
        return distance < Math.abs(this.radius + crashable.radius);
      } else {
        return PolygonCollider.polygonCollidesWithCircle(crashable, this);
      }
    }
    return false;
  }

  public crashHandle(crashable: ICollisible):void {
    if (crashable instanceof Ball) {
      let axis = Vector2D.difference(crashable.center, this.center);
      Physical.surfaceVelocityReflect(crashable.massPoint, axis);
    }
  }
}

export class CircleMapItem extends PolygonMapItem {
  public static readonly imageURL:string = "img/item/circle.png";
  public static readonly Name:MapItemNames = "circle";
  get name():MapItemNames {
    return CircleMapItem.Name;
  }
  get imgURL(): string {
    return CircleMapItem.imageURL;
  }
  constructor(x:number, y:number) {
    super(new CircleCollider(new Vector2D(x, y), MapItem.gridScale / 2));
  }
}
