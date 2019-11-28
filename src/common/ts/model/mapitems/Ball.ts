import { MassPoint, Physical } from "../Physical";
import {
  ICollisible,
  MapItem,
  MapItemNames,
  ITransmittable
} from "./MapItem";
import { Vector2D } from "../../util/Vector";
import { CircleCollider } from './Circle';

export class Ball extends MapItem {
  public get name():MapItemNames {
    return Ball.Name;
  }
  public get center():Vector2D {
    return this.collider.center;
  }
  public massPoint:MassPoint;
  public pipeID:number = -1;
  public crashHandle(crashable:ICollisible):void {
    if (crashable instanceof Ball) {
      Physical.perfectElasticCollision(this.massPoint, crashable.massPoint);
    } else {
      super.crashHandle(crashable);
    }
  }

  public translate(p:Vector2D):ITransmittable {
    super.translate(p);
    this.massPoint.translate(this.center);
    return this;
  }
  public static readonly Name:MapItemNames = "ball";
  public static readonly imageUrl:string = "img/item/ball.png";

  get imgURL():string {
    return Ball.imageUrl;
  }

  constructor(x:number, y:number) {
    super(new CircleCollider(new Vector2D(x, y), MapItem.gridScale / 2));
    this.massPoint = new MassPoint();
    this.massPoint.translate(this.center);
  }
}
