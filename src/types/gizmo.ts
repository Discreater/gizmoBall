import { MapItemNames } from "@/common/ts/model/mapitems/MapItems";

export interface ViewItem {
  typeValue: ItemType,
  img: string
}

export function isViewItem(obj: any): obj is ViewItem {
  return obj.typeValue !== undefined;
}

export interface MapElement {
  x: number,
  y: number,
  typeValue: ItemType,
  img: string
}

export type ItemType = 'select' | MapItemNames;


export namespace Gizmo {
  export const gridLength: number = 35

  export const gridLineLength: number = 1

  export const sampleItem: ViewItem = {
    typeValue: 'select',
    img: "img/item/select.png"
  }
  export const selectItem: ViewItem = {
    typeValue: 'select',
    img: "img/item/select.png"
  }
  export const ballItem: ViewItem = {
    typeValue: 'ball',
    img: "img/item/ball.png"
  }
  export const absorberItem: ViewItem = {
    typeValue: 'absorber',
    img: "img/item/absorber.png"
  }
  export const triangleItem: ViewItem = {
    typeValue: 'triangle',
    img: 'img/item/triangle.png'
  }
  export const circleItem: ViewItem = {
    typeValue: 'circle',
    img: 'img/item/circle.png'
  }
  export const squareItem: ViewItem = {
    typeValue: 'square',
    img: 'img/item/square.png'
  }
  export const pipeItem: ViewItem = {
    typeValue: 'pipe',
    img: 'img/item/pipe_normal.png'
  }
  export const pipeTurnedItem: ViewItem = {
    typeValue: 'pipe-turned',
    img: 'img/item/pipe_turned.png'
  }
  export const baffleAlphaItem: ViewItem = {
    typeValue: 'baffle-alpha',
    img: 'img/item/baffle-mid.png'
  }
  export const baffleBetaItem: ViewItem = {
    typeValue: 'baffle-beta',
    img: 'img/item/baffle-mid.png'
  }
  export const sampleItems: ViewItem[] = [
    sampleItem,
    ballItem
  ]
  export const itemss: ViewItem[][] = [
    [selectItem, ballItem],
    [absorberItem, triangleItem],
    [circleItem, squareItem],
    [pipeItem, pipeTurnedItem],
    [baffleAlphaItem, baffleBetaItem]
  ]

  const itemMap: Record<ItemType, ViewItem> = {
    'absorber': absorberItem,
    'baffle-alpha': baffleAlphaItem,
    'baffle-beta': baffleBetaItem,
    'ball': ballItem,
    'circle': circleItem,
    'pipe': pipeItem,
    'pipe-turned': pipeTurnedItem,
    'select': selectItem,
    'square': squareItem,
    'triangle': triangleItem,
    'border': selectItem
  }
  export function getViewItemByType(typeValue: ItemType): ViewItem {
    return itemMap[typeValue];
  }
}
