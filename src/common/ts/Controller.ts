import {
  MapItem,
  IZoomable,
  isRotatable,
  Direction,
  isZoomable,
  MapItemNames
} from "./model/mapitems/MapItem"
import FileSystem from "./fs/FileSystem"
import { Vector2D, Angle } from './util/Vector';
import store from "../../store/index"
import { Ball, itemMap, TriangleMapItem } from './model/mapitems/MapItems';
import { Physical } from './model/Physical';
import { BorderMapItem } from './model/mapitems/BorderMapItem';
import {
  BaffleAlphaMapItem,
  BaffleBetaMapItem,
  BaffleMapItem
} from './model/mapitems/Baffle';
import { remote } from 'electron';

abstract class MapItemJSON {
  abstract name: MapItemNames;
  abstract position: Vector2D;
  abstract zoom?: number;
  abstract rotation?: Direction;
  public static createFromJSON(obj: any): MapItemJSON | null {
    if (obj.name && obj.position && obj.position.x && obj.position.y) {
      return {
        name: obj.name,
        position: new Vector2D(obj.position.x, obj.position.y),
        zoom: obj.zoom,
        rotation: obj.rotation
      };
    } else {
      return null;
    }
  }
}


export class Controller {
  private static controller : Controller;
  public static readonly maxGridCount:number = 20;
  public static readonly maxXY:number = Controller.maxGridCount * MapItem.gridScale;
  public static getInstance() : Controller {
    return this.controller ?? (this.controller = new Controller());
  }

  /**
   * 当前打开的文件路径，若为空则表明未打开任何文件
   */
  private currentOpenedFilePath: string | null = null;

  /**
   * 当前文件是否被修改
   */
  private currentFileModified: boolean = false;

  private mapItems: Map<number, MapItem>;
  private balls: Map<number, Ball>;
  private border: BorderMapItem;
  private alphaBaffles:Map<number, BaffleAlphaMapItem>;
  private betaBaffles:Map<number, BaffleBetaMapItem>;
  private constructor() {
    this.mapItems = new Map<number, MapItem>();
    this.balls = new Map<number, Ball>();
    this.border = new BorderMapItem();
    this.mapItems.set(this.border.id, this.border);
    this.alphaBaffles = new Map<number, BaffleAlphaMapItem>();
    this.betaBaffles = new Map<number, BaffleBetaMapItem>();
  }

  public get items():MapItem[] {
    let mapItem :MapItem[] = [];
    for (let [, item] of this.mapItems) {
      if (!(item instanceof BorderMapItem)) {
        mapItem.push(item);
      }
    }
    return mapItem;
  }

  /**
   * 创建地图元素实例
   * @param name 类型
   * @param x
   * @param y
   * @returns 是否成功
   */
  public createMapItem(name: MapItemNames, x: number, y:number): boolean {
    const mapItem = new itemMap[name](x, y);
    console.log(mapItem);
    return this.handleAddItem(mapItem);
  }

  /**
   * 打开文件
   */
  public open() {
    if (this.currentFileModified) {
      remote.dialog.showMessageBox(
        remote.getCurrentWindow(),
        {
          type: 'question',
          buttons: ['保存', '不保存', '取消'],
          message: '当前文件为保存，是否保存?',
          defaultId: 0,
          cancelId: 2
        },
        (response, checkboxChecked) => {
          switch (response) {
            case 0:
              this.save()
              break
            case 1:
              break
            case 2:
              return
            default:
              break
          }
        }
      )
    } else {
      this.openFile();
    }
  }

  private openFile() {
    FileSystem.open((path, data) => {
      let items = this.readFromJSON(data);
      if (items != null) {
        this.mapItems.clear();
        this.currentOpenedFilePath = path;
        for (let item of items) {
          this.mapItems.set(item.id, item);
        }
      } else {
        remote.dialog.showMessageBox(
          remote.getCurrentWindow(),
          {
            type: 'error',
            buttons: [],
            message: '文件已损坏'
          }
        )
      }
    })
  }

  private readFromJSON(content: string): MapItem[] | null {
    console.log(content);
    const jsonItems = JSON.parse(content);
    let items: MapItem[] = [];
    if (jsonItems instanceof Array) {
      for (let jsonItem of jsonItems) {
        console.log(jsonItem);
        const item = MapItemJSON.createFromJSON(jsonItem);
        if (item !== null) {
          console.log('is MapItemsJSON');
          const mapItem = new itemMap[item.name](item.position.x, item.position.y);
          // 检测是否旋转
          if (isRotatable(mapItem)) {
            if (item.rotation) {
              mapItem.rotation = item.rotation;
            } else {
              return null;
            }
          }
          // 检测是否放缩
          if (isZoomable(mapItem)) {
            if (item.zoom) {
              mapItem.zoomTo(mapItem.position, item.zoom);
            } else {
              return null;
            }
          }
          items.push(mapItem);
        } else {
          return null;
        }
      }
    }
    // 检测是否发生碰撞
    for (let from of items) {
      for (let to of items) {
        if (from.id !== to.id && from.crashDetect(to)) {
          return null;
        }
      }
    }
    return items;
  }

  /**
   * 保存文件
   */
  public save() {
    if (!this.currentOpenedFilePath) {
      this.saveAs();
    } else {
      const content = this.mapItemsToJSON(this.mapItems);
      FileSystem.save(content, this.currentOpenedFilePath);
    }
  }

  /**
   * 另存为文件
   */
  public saveAs() {
    const content = this.mapItemsToJSON(this.mapItems);
    FileSystem.saveAs(content);
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
    } else if (mapitem instanceof BaffleAlphaMapItem) {
      this.alphaBaffles.set(mapitem.id, mapitem);
    } else if (mapitem instanceof BaffleBetaMapItem) {
      this.betaBaffles.set(mapitem.id, mapitem);
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
    this.balls.delete(id);
    this.alphaBaffles.delete(id);
    this.betaBaffles.delete(id);
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
      if (zoom <= 1) {
        return false;
      }
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
      mapItem.rotate(mapItem.center, Angle.RIGHT_ANGLE);
      console.log(this.mapItems);
      if (this.collidesWithOthers(mapItem)) {
        mapItem.rotate(mapItem.center, Angle.RIGHT_ANGLE_REVERSE);
        return false;
      }
      return true;
    }
    return false;
  }

  private isPlaying:boolean = false;

  /**
   * 开始游玩模式
   */
  public startPlaying():void {
    // todo

    for (let kv of this.balls) {
      const ball:Ball = kv[1];
      ball.massPoint.setAcceleration('gravity', Physical.gravity);
      ball.massPoint.setAcceleration('pipe', new Vector2D(0, 0));
      ball.massPoint.setAcceleration('centripetal', new Vector2D(0, 0));
    }
    this.isPlaying = true;
    const timer:NodeJS.Timeout = setInterval(() => {
      if (this.isPlaying) {
        for (let [, ball] of this.balls) {
          // console.log(Physical.gravity);
          // console.log(ball.massPoint.v);
          ball.massPoint.tick();

          // old implementation of border detect

          // const center:Vector2D = ball.center;
          // const x:number = center.x,
          //   y:number = center.y;
          // const r:number = MapItem.gridScale * 0.5;
          // const v:Vector2D = ball.massPoint.v;
          // const m:number = Controller.maxXY;
          // const delta:number = 0;
          // if (x + r > m) {
          //   ball.massPoint.setVelocity(new Vector2D(-Math.abs(v.x), v.y));
          //   ball.massPoint.translate(new Vector2D(m - r - delta, y));
          // }
          // if (x - r < 0) {
          //   ball.massPoint.setVelocity(new Vector2D(Math.abs(v.x), v.y));
          //   ball.massPoint.translate(new Vector2D(delta + r, y));
          // }
          // if (y + r > m) {
          //   ball.massPoint.setVelocity(new Vector2D(v.x, -Math.abs(v.y)));
          //   ball.massPoint.translate(new Vector2D(x, m - r - delta));
          // }
          // if (y - r < 0) {
          //   ball.massPoint.setVelocity(new Vector2D(v.x, Math.abs(v.y)));
          //   ball.massPoint.translate(new Vector2D(x, delta + r));
          // }
          ball.translate(Vector2D.difference(ball.position, ball.center).add(ball.massPoint.p));
          for (let [, item] of this.mapItems) {
            if (item.id != ball.id) {
              // console.log("detecting...");
              if (item.crashDetect(ball)) {
                // console.log("detected!")
                item.crashHandle(ball);
              }
            }
          }
        }
      } else {
        clearInterval(timer);
      }
    }, 1);
  }

  /**
   * 停止游玩
   */
  public stopPlaying():void {
    // todo
    this.isPlaying = false;
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
      mapItemJSONs.push(mapItemJSON);
    }
    return JSON.stringify(mapItemJSONs);
  }

  public handleBaffleMove(name:MapItemNames, direction:"left"|"right") {
    const movement:Vector2D = Vector2D.ZERO;
    switch (direction) {
      case "left":
        movement.x = -5;
        break;
      case "right":
        movement.x = 5;
        break;
      default:
        break;
    }
    switch (name) {
      case 'baffle-alpha':
        for (let [, baffle] of this.alphaBaffles) {
          baffle.move(movement);
          if (this.collidesWithOthers(baffle)) {
            baffle.move(Vector2D.negate(movement));
          }
        }
        break;
      case 'baffle-beta':
        for (let [, baffle] of this.betaBaffles) {
          baffle.move(movement);
          if (this.collidesWithOthers(baffle)) {
            baffle.move(Vector2D.negate(movement));
          }
        }
        break;
      default:
        break;
    }
  }
}

export default Controller;
