import { Position } from './Physical'

export abstract class MapItem {
  private _position:Position;
  get imgURL():string {
    return '';
  }
  constructor(x:number, y:number, public scale:number = 1) {
    this._position = {
      y: y,
      x: x
    };
  }
  public get position():Position {
    return this._position;
  }

  public set position(position: Position) {
    this._position = position;
  }

  public abstract crashDetect():boolean;
  public abstract crashHandle(ball:MapItem):void;
}

export enum Direction{
  Up, Down, Left, Right
}
export interface Rotatable {
  rotation: Direction;
}

export abstract class RotatableMapItem extends MapItem implements Rotatable {
  public rotation:Direction;
  constructor(x:number, y:number) {
    super(x, y)
    this.rotation = Direction.Up;
  }
}

