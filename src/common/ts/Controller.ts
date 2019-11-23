import { MapItem, IZoomable } from "./model/mapitems/MapItem"
import FileSystem from "./fs/FileSystem"
import { Vector2D } from './util/Vector';

enum Status {

  /**
   * 布局模式
   */
  Putting,

  /**
   * 游玩模式
   */
  Playing,
}

export class Controller {
  private static controller : Controller;
  public static getInstance() : Controller {
    return this.controller ?? (this.controller = new Controller());
  }
  private mapItems: Map<number, MapItem>;
  private constructor() {
    this.mapItems = new Map<number, MapItem>();
    let k:MapItem & string;
  }

  public saveAs() {
    const content:string = JSON.stringify(this.mapItems);
    FileSystem.saveAs(content);
  }

  private _status:Status = Status.Putting;
  get status():Status {
    return this._status;
  }

  /**
   * 处理元件添加,返回是否成功添加
   * @param mapitem 添加的元件
   */
  public handleAddItem(mapitem:MapItem):boolean {
    // todo
    return false;
  }

  /**
   * 拖动元件的处理,返回是否成功拖动
   * @param id 元件ID
   * @param newPosition 新位置
   */
  public handleDraggingItem(id:number, newPosition:Vector2D):boolean {
    // todo
    return false;
  }

  /**
   * 删除元件的处理,返回是否成功删除
   * @param id 元件ID
   */
  public handleDeleteItem(id:number):boolean {
    return this.mapItems.delete(id);
  }

  /**
   * 处理放大操作,返回是否成功放大
   * @param id 元件ID
   */
  public handleZoomIn(id:number):boolean {
    // todo
    return false;
  }

  /**
   * 处理缩小操作,返回是否成功缩小
   * @param id 元件ID
   */
  public handleZoomOut(id:number):boolean {
    // todo
    return false;
  }

  /**
   * 处理旋转操作,返回是否成功旋转
   * @param id 元件ID
   */
  public handleRotate(id:number):boolean {
    // todo
    return false;
  }

  /**
   * 开始游玩模式
   */
  public startPlaying():void {
    this._status = Status.Playing;
    // todo
  }

  /**
   * 渲染处理
   */
  public render():void {
    // todo
  }

  /**
   * 停止游玩
   */
  public stopPlaying():void {
    this._status = Status.Putting;
    // todo
  }
}

export default Controller;
