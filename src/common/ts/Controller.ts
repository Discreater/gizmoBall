import {
  MapItem,
  IZoomable,
  isRotatable,
  Direction,
  isZoomable,
  MapItemNames,
  Ball
} from "./model/mapitems/MapItem"
import FileSystem from "./fs/FileSystem"
import { Vector2D, Angle } from './util/Vector';
import store from "../../store/index"

abstract class MapItemJSON {
  abstract name: MapItemNames;
  abstract position: Vector2D;
  abstract zoom?: number;
  abstract rotation?: Direction;
}


export class Controller {
  private static controller : Controller;
  public static getInstance() : Controller {
    return this.controller ?? (this.controller = new Controller());
  }
  private mapItems: Map<number, MapItem>;
  private balls: Map<number, Ball>;
  private constructor() {
    this.mapItems = new Map<number, MapItem>();
    this.balls = new Map<number, Ball>();
  }

  /**
   * 当前打开的文件路径，若为空则表明未打开任何文件
   */
  private currentOpendFilePath: string | null = null;

  /**
   * 打开文件
   */
  public open() {}

  /**
   * 保存文件
   */
  public save() {
    if (!this.currentOpendFilePath) {
      this.saveAs();
    } else {
      const content = this.mapItemsToJSON(this.mapItems);
      FileSystem.save(content, this.currentOpendFilePath);
    }
  }

  /**
   * 另存为文件
   */
  public saveAs() {
    const content = this.mapItemsToJSON(this.mapItems);
    FileSystem.saveAs(content);
  }

  /**
   * 将mapItems转换为JSON格式string
   */
  private mapItemsToJSON(mapItems: Map<number, MapItem>): string {
    let mapItemJSONs: MapItemJSON[] = [];
    for (let item of mapItems) {
      const mapItem:MapItem = item[1];
      const mapItemJSON: MapItemJSON = {
        name: mapItem.name,
        position: mapItem.position,
        rotation: isRotatable(mapItem) ? mapItem.rotation : undefined,
        zoom: isZoomable(mapItem) ? mapItem.zoom : undefined
      }
      const json:MapItemJSON = mapItem as MapItemJSON;
      console.log("as:");
      console.log(json);
      console.log("converted");
      console.log(mapItemJSON);
      mapItemJSONs.push(mapItemJSON);
    }
    return JSON.stringify(mapItemJSONs);
  }


  private collidesWithOthers(mapItem:MapItem):boolean {
    for (let element of this.mapItems) {
      if (element[0] !== mapItem.id && element[1].crashDetect(mapItem)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 处理元件添加,返回是否成功添加
   * @param mapitem 添加的元件
   */
  public handleAddItem(mapitem:MapItem):boolean {
    for (let i of this.mapItems) {
      if (i[1].crashDetect(mapitem)) {
        return false;
      }
    }
    this.mapItems.set(mapitem.id, mapitem);
    if (mapitem instanceof Ball) {
      this.balls.set(mapitem.id, mapitem);
    }
    return true;
  }

  /**
   * 拖动元件的处理,返回是否成功拖动
   * @param id 元件ID
   * @param newPosition 新位置
   */
  public handleDraggingItem(id:number, newPosition:Vector2D):boolean {
    let mapItem:MapItem | undefined = this.mapItems.get(id);
    if (mapItem !== undefined) {
      let oldPosition:Vector2D = mapItem.position;
      mapItem.translate(newPosition);
      if (this.collidesWithOthers(mapItem)) {
        mapItem.translate(oldPosition);
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * 删除元件的处理,返回是否成功删除
   * @param id 元件ID
   */
  public handleDeleteItem(id:number):boolean {
    if (this.mapItems.get(id) instanceof Ball) {
      this.balls.delete(id);
    }
    return this.mapItems.delete(id);
  }

  /**
   * 处理放大操作,返回是否成功放大
   * @param id 元件ID
   */
  public handleZoomIn(id:number):boolean {
    let mapItem:MapItem | undefined = this.mapItems.get(id);
    if (mapItem !== undefined && isZoomable(mapItem)) {
      const zoom:number = mapItem.zoom;
      mapItem.zoomTo(mapItem.position, zoom + 1);
      if (this.collidesWithOthers(mapItem)) {
        mapItem.zoomTo(mapItem.position, zoom);
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * 处理缩小操作,返回是否成功缩小
   * @param id 元件ID
   */
  public handleZoomOut(id:number):boolean {
    let mapItem:MapItem | undefined = this.mapItems.get(id);
    if (mapItem !== undefined && isZoomable(mapItem)) {
      const zoom:number = mapItem.zoom;
      mapItem.zoomTo(mapItem.position, zoom - 1);
      if (this.collidesWithOthers(mapItem)) {
        mapItem.zoomTo(mapItem.position, zoom);
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * 处理旋转操作,返回是否成功旋转
   * @param id 元件ID
   */
  public handleRotate(id:number):boolean {
    let mapItem:MapItem | undefined = this.mapItems.get(id);
    if (mapItem !== undefined && isRotatable(mapItem)) {
      mapItem.rotate(mapItem.center, Angle.RIGHT_ANGLE_REVERSE);
      if (this.collidesWithOthers(mapItem)) {
        mapItem.rotate(mapItem.center, Angle.RIGHT_ANGLE);
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * 开始游玩模式
   */
  public startPlaying():void {
    // todo
  }


  /**
   * 停止游玩
   */
  public stopPlaying():void {
    // todo
  }
}

export default Controller;
