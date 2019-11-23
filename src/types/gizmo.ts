export interface ViewItem {
  typeValue: ItemType,
  img: string
}

export interface MapElement {
  x: number,
  y: number,
  typeValue: ItemType,
  img: string
}

export type ItemType = 'select' | 'ball' | 'absorber' | 'triangle' | 'circle' | 'square' |
                        'pipe' | 'pipeTurned' | 'baffleAlpha' | 'baffleBeta'

export const gridLength: number = 35

export const gridLineLength: number = 1

export namespace Gizmo {
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
    typeValue: 'pipeTurned',
    img: 'img/item/pipe_turned.png'
  }
  export const baffleAlphaItem: ViewItem = {
    typeValue: 'baffleAlpha',
    img: 'img/item/baffle-mid.png'
  }
  export const baffleBetaItem: ViewItem = {
    typeValue: 'baffleBeta',
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
    'baffleAlpha': baffleAlphaItem,
    'baffleBeta': baffleBetaItem,
    'ball': ballItem,
    'circle': circleItem,
    'pipe': pipeItem,
    'pipeTurned': pipeTurnedItem,
    'select': selectItem,
    'square': squareItem,
    'triangle': triangleItem
  }
  export function getViewItemByType(typeValue: ItemType): ViewItem {
    return itemMap[typeValue];
  }
}
