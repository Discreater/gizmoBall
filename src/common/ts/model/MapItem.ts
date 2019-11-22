import { MassPoint } from "./Physical";
import { Vector2D } from "./Vector";
import { Ball } from "./Ball";


export abstract class MapItem {
  private _position:Vector2D;
  get imgURL(): string {
    return "";
  }
  constructor(x: number, y: number, public scale: number = 1) {
    this._position = new Vector2D(x, y);
  }
  public get position(): Vector2D {
    return this._position;
  }

  public set position(position: Vector2D) {
    this._position = position;
  }

  public abstract crashDetect (ball: Ball): boolean;
  public abstract crashHandle (ball: Ball): void;
}

export enum Direction {
  Up, Right, Down, Left
}
export interface IRotatable {
  rotation: Direction;
  rotate():void;
}

export abstract class RotatableMapItem extends MapItem implements IRotatable {
  public rotation: Direction;
  rotate(): void {
    this.rotation = (this.rotation + 1) % 4;
  }
  constructor(x: number, y: number) {
    super(x, y);
    this.rotation = Direction.Up;
  }
}

export class Square extends RotatableMapItem {
  public crashDetect(ball:Ball):boolean {
    return false;
  }
  public crashHandle(ball:Ball):void {
    return;
  }
}
