import {
  ICollisible,
  ITransmittable,
  IRotatable,
  IZoomable,
  Direction
} from './MapItem';
import { Vector2D, Angle } from '../../util/Vector';

export abstract class Collider implements ICollisible, ITransmittable, IRotatable, IZoomable {

  public abstract crashDetect(crashable: ICollisible): boolean;
  public abstract crashHandle(crashable: ICollisible): void;

  protected _position!:Vector2D;
  public get position(): Vector2D {
    return this._position.clone();
  }
  public set position(position: Vector2D) {
    this.translate(position);
  }
  public abstract center:Vector2D;
  public abstract translate(point: Vector2D): ITransmittable;

  protected _rotation:Direction = Direction.Up;
  public get rotation(): Direction {
    return this._rotation;
  }
  public set rotation(rotation: Direction) {
    let times: number = (this._rotation - rotation + 4) % 4;
    for (let i: number = 0; i < times; i++) {
      this.rotate(this.center, Angle.RIGHT_ANGLE_REVERSE);
    }
    this._rotation = rotation;
  }
  public abstract rotate(center:Vector2D, angle:Angle):IRotatable;


  protected _zoom:number = 1;
  public get zoom(): number {
    return this._zoom;
  }

  public set zoom(zoom: number) {
    if (zoom <= 0) {
      throw new Error("Zoom value must be positive");
    }
    this.zoomTo(this.position, zoom);
  }
  public abstract zoomTo(zoomCenter:Vector2D, zoom: number): IZoomable;
}
