import { Vector2D, Angle } from "../../util/Vector";
import { Collider } from './Collider';

// export * from "./Ball";
// export * from "./Square";
// export * from "./Circle";
// export * from "./Polygon";
// export * from "./Triangle";
export { Collider };

export type MapItemNames = "absorber"|"baffle-alpha"|"baffle-beta"|"ball"|"border"|"circle"|"pipe"|"pipe-turned"|"square"|"triangle";

export enum Direction {
  Up,
  Right,
  Down,
  Left
}

export interface IRotatable {

  /**
   * 旋转偏移量
   */
  rotation: Direction;

  /**
   * 旋转操作
   * @param center 旋转中心
   * @param angle 旋转角
   */
  rotate(center: Vector2D, angle: Angle): IRotatable;
}

export function isRotatable(obj: any): obj is IRotatable {
  return obj.rotate !== undefined;
}

export interface ICollisible {

  /**
   * 碰撞检测,返回是否碰撞
   * @param crashable 可碰撞对象
   */
  crashDetect(crashable: ICollisible): boolean;

  /**
   * 碰撞处理函数
   * @param crashable 被碰撞的对象
   */
  crashHandle(crashable: ICollisible): void;
}

export interface IZoomable {

  /**
   * 仿射倍率，必须为正值
   */
  zoom: number;

  /**
   *
   * @param zoomCenter 仿射中心
   * @param zoom 仿射倍率，必须为正
   */
  zoomTo(zoomCenter: Vector2D, zoom: number): IZoomable;
}

export function isZoomable(obj: any): obj is IZoomable {
  return obj.zoomTo !== undefined;
}

export interface ITransmittable {

  /**
   * 校准点
   */
  position: Vector2D;

  /**
   * 所占格点的中心
   */
  center: Vector2D;

  /**
   * 传送
   * @param point 传送目标坐标
   */
  translate(point: Vector2D): ITransmittable;
}

export abstract class MapItem implements ICollisible, ITransmittable {
  abstract get name():MapItemNames;
  get center(): Vector2D {
    return this.collider.center;
  }
  translate(point: Vector2D): ITransmittable {
    this.collider.translate(point);
    return this;
  }
  public crashDetect(crashable: ICollisible): boolean {
    if (crashable instanceof MapItem) {
      return this.collider.crashDetect(crashable.collider);
    }
    return this.collider.crashDetect(crashable);
  }
  public crashHandle(crashable: ICollisible): void {
    return this.collider.crashHandle(crashable);
  }

  /**
   * 格点大小，单位为像素
   */
  public static readonly gridScale: number = 36;

  /**
   * 单位格点的垂直正方向向量
   */
  public static readonly vertical: Vector2D = new Vector2D(
    0,
    MapItem.gridScale
  );

  /**
   * 单位格点的水平正方向向量
   */
  public static readonly horizontal: Vector2D = new Vector2D(
    MapItem.gridScale,
    0
  );

  /**
   * 图片素材的URL
   */
  abstract get imgURL(): string;

  protected static currentID:number = 0;
  public readonly id:number;

  constructor(protected collider:Collider) {
    this.id = ++MapItem.currentID;
    console.log(`MapItem ${this.id} init`);
  }

  public get position(): Vector2D {
    return this.collider.position;
  }
  public set position(position: Vector2D) {
    this.collider.position = position;
  }
}
