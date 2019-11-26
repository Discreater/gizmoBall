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

export class PipeCollider extends PolygonCollider {
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

export class PipeMapItem extends PolygonMapItem {
  public get name():MapItemNames {
    return PipeMapItem.Name;
  }
  get imgURL(): string {
    return PipeMapItem.imageUrl;
  }

  public static readonly Name:MapItemNames = "pipe";
  public static readonly imageUrl:string = "img/item/pipe_normal.png";

  constructor(x:number, y:number) {
    super(new PipeCollider(new Vector2D(x, y)));
  }

}
