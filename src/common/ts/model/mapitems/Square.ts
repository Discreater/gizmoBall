import {
  MapItem,
  ICollisible,
  IRotatable,
  IZoomable,
  Direction,
  MapItemNames
} from "./MapItem";
import { Vector2D, Angle } from "../../util/Vector";
import { PolygonCollider, PolygonMapItem } from "./Polygon";

export class SquareCollider extends PolygonCollider {
  public get center(): Vector2D {
    return this.position.add(MapItem.vertical.clone().add(MapItem.horizontal).mult(0.5 * this.zoom));
  }
  constructor(position: Vector2D) {
    super(
      [
        position.clone(),
        position.clone().add(MapItem.vertical),
        position
          .clone()
          .add(MapItem.horizontal)
          .add(MapItem.vertical),
        position.clone().add(MapItem.horizontal)
      ],
      position
    );
  }
}

export class SquareMapItem extends PolygonMapItem {
  public get name():MapItemNames {
    return SquareMapItem.Name;
  }
  get imgURL(): string {
    return SquareMapItem.imageUrl;
  }

  public static readonly Name:MapItemNames = "square";
  public static readonly imageUrl:string = "img/item/ball.png";

  constructor(x:number, y:number) {
    super(new SquareCollider(new Vector2D(x, y)));
  }

}
