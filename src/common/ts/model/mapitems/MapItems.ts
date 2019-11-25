import { Ball } from './Ball';
import { MapItem, MapItemNames } from './MapItem';
import { AbsorberMapItem } from './Absorber';
import { CircleMapItem } from './Circle';
import { PolygonMapItem } from './Polygon';
import { SquareMapItem } from './Square';
import { TriangleMapItem } from './Triangle';

export * from "./Absorber";
export * from "./Ball";
export * from "./Circle";
export * from "./Collider";
export * from "./MapItem";
export * from "./Polygon";
export * from "./Square";
export * from "./Triangle";

export type MapItems = typeof AbsorberMapItem | typeof Ball | typeof CircleMapItem | typeof SquareMapItem | typeof TriangleMapItem;
interface x {
  name:MapItemNames;
  type:MapItems;
}
const itemMap:Map<MapItemNames, MapItems> = new Map<MapItemNames, MapItems>();

itemMap.set("absorber", AbsorberMapItem);
itemMap.set("ball", Ball);
itemMap.set("circle", CircleMapItem);
itemMap.set("square", SquareMapItem);
itemMap.set("triangle", TriangleMapItem);

export { itemMap };

