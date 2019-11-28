import { PolygonMapItem, PolygonCollider } from './Polygon';
import {
  MapItemNames,
  Collider,
  MapItem,
  ICollisible,
  ITransmittable,
  IZoomable,
  IRotatable
} from './MapItem';
import { Vector2D, Angle } from '../../util/Vector';
import Controller from '../../Controller';
import { Ball } from './Ball';

export class BorderCollider extends Collider {

  protected borders:PolygonCollider[] = [];
  constructor() {
    super();
    this._position = Vector2D.ZERO;
    const vertical:Vector2D = MapItem.vertical.clone(),
      horizontal:Vector2D = MapItem.horizontal.clone(),
      verticalMax:Vector2D = Vector2D.mult(vertical, Controller.maxGridCount),
      horizontalMax:Vector2D = Vector2D.mult(horizontal, Controller.maxGridCount);

    this.borders.push(new PolygonCollider([
      Vector2D.negate(horizontal),
      Vector2D.difference(verticalMax, horizontal),
      Vector2D.copy(verticalMax),
      Vector2D.ZERO
    ]));
    this.borders.push(new PolygonCollider([
      Vector2D.copy(verticalMax),
      Vector2D.add(verticalMax, vertical),
      Vector2D.add(verticalMax, vertical).add(horizontalMax),
      Vector2D.add(horizontalMax, verticalMax)
    ]));
    this.borders.push(new PolygonCollider([
      Vector2D.copy(horizontalMax),
      Vector2D.add(verticalMax, horizontalMax),
      Vector2D.add(verticalMax, horizontalMax).add(horizontal),
      Vector2D.add(horizontal, horizontalMax)
    ]));
    this.borders.push(new PolygonCollider([
      Vector2D.negate(vertical),
      Vector2D.ZERO,
      Vector2D.copy(horizontalMax),
      Vector2D.difference(horizontalMax, vertical)
    ]));
  }

  public crashDetect(crashable: ICollisible): boolean {
    for (let border of this.borders) {
      if (border.crashDetect(crashable) || crashable.crashDetect(border)) {
        return true;
      }
    }
    return false;
  }
  public crashHandle(crashable: ICollisible): void {
    if (crashable instanceof Ball) {
      for (let border of this.borders) {
        if (crashable.crashDetect(border)) {
          border.crashHandle(crashable);
        }
      }
    }
  }
  public get center():Vector2D {
    throw new Error("Method not implemented.");
  }
  public translate(point: Vector2D): ITransmittable {
    throw new Error("Method not implemented.");
  }
  public rotate(center:Vector2D, angle:Angle): IRotatable {
    throw new Error("Method not implemented.");
  }
  public zoomTo(zoomCenter: Vector2D, zoom: number): IZoomable {
    throw new Error("Method not implemented.");
  }


}

export class BorderMapItem extends MapItem {
  get name(): MapItemNames {
    return "border";
  }
  get imgURL(): string {
    return "";
  }
  constructor() {
    super(new BorderCollider());
  }

}
