import { MassPoint } from "./Physical";

export class Ball {
  public massPoint:MassPoint;
  public static imageUrl:string = "img/item/ball.png";
  get imgURL():string {
    return Ball.imageUrl;
  }
  constructor() {
    this.massPoint = new MassPoint();
  }
}

