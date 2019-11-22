import { MassPoint } from "./Physical";
import { ICollisible } from "./MapItem";

export class Ball implements ICollisible {
  crashDetect(crashable: ICollisible): boolean {
    throw new Error("Method not implemented.");
  }
  crashHandle(crashable: ICollisible): void {
    throw new Error("Method not implemented.");
  }
  public massPoint:MassPoint;
  public static imageUrl:string = "img/item/ball.png";
  get imgURL():string {
    return Ball.imageUrl;
  }
  constructor() {
    this.massPoint = new MassPoint();
  }
}

