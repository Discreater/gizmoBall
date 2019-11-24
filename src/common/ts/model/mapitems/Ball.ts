import { MassPoint } from "../Physical";
import {
  ICollisible,
  CircleCollider,
  MapItem,
  MapItemNames
} from "./MapItem";
import { Vector2D } from "../../util/Vector";

export class Ball extends MapItem implements ICollisible {
  public get name():MapItemNames {
    return Ball.Name;
  }
  public get center():Vector2D {
    return this.collider.center;
  }
  public massPoint:MassPoint;
  public static readonly Name:MapItemNames = "ball";
  public static readonly imageUrl:string = "img/item/ball.png";

  get imgURL():string {
    return Ball.imageUrl;
  }

  constructor(x:number, y:number) {
    super(new CircleCollider(new Vector2D(x, y), MapItem.gridScale / 2));
    this.massPoint = new MassPoint();
  }
}
