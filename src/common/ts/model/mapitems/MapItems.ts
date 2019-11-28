import { Ball } from './Ball';
import { MapItem, MapItemNames } from './MapItem';
import { AbsorberMapItem } from './Absorber';
import { CircleMapItem } from './Circle';
import { PolygonMapItem } from './Polygon';
import { SquareMapItem } from './Square';
import { TriangleMapItem } from './Triangle';
import {
  BaffleMapItem,
  BaffleBetaMapItem,
  BaffleAlphaMapItem
} from './Baffle';
import { PipeMapItem } from './Pipe';
import { PipeTurnedMapItem } from './PipeTurned';
import { BorderMapItem } from './BorderMapItem';

export * from "./Absorber";
export * from "./Ball";
export * from "./Circle";
export * from "./Collider";
export * from "./MapItem";
export * from "./Polygon";
export * from "./Square";
export * from "./Triangle";
export * from "./Pipe";
export * from "./PipeTurned";

export type MapItems =
  typeof AbsorberMapItem |
  typeof BaffleAlphaMapItem |
  typeof BaffleBetaMapItem |
  typeof Ball |
  typeof BorderMapItem |
  typeof CircleMapItem |
  typeof PipeMapItem |
  typeof PipeTurnedMapItem |
  typeof SquareMapItem |
  typeof TriangleMapItem;


const itemMap: Record<MapItemNames, MapItems> = {
  absorber: AbsorberMapItem,
  "baffle-alpha": BaffleAlphaMapItem,
  "baffle-beta": BaffleBetaMapItem,
  ball: Ball,
  border: BorderMapItem,
  circle: CircleMapItem,
  pipe: PipeMapItem,
  "pipe-turned": PipeTurnedMapItem,
  square: SquareMapItem,
  triangle: TriangleMapItem
}

export { itemMap };

