import { Position, Velocity } from './Physical';

export class Ball {
  public position:Position;
  public static imageUrl:string = "img/item/ball.png";
  get imgURL():string {
    return Ball.imageUrl;
  }
  constructor() {
    this.position = { x: 0, y: 0 }
    this.velocity = { vx: 0, vy: 0 }
  }
  public velocity:Velocity;
}

