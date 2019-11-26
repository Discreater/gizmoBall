import { PolygonMapItem, PolygonCollider } from "./Polygon";
import { MapItemNames, MapItem } from './MapItem';
import { Vector2D } from '../../util/Vector';

export class BaffleCollider extends PolygonCollider {
  constructor(position:Vector2D) {

    const vertical:Vector2D = MapItem.vertical.clone().mult(0.25);
    super(
      [
        position.clone(),
        position.clone().add(vertical),
        position
          .clone()
          .add(MapItem.horizontal)
          .add(vertical),
        position.clone().add(MapItem.horizontal)
      ],
      position
    );
  }

}

export abstract class BaffleMapItem extends PolygonMapItem {
  get imgURL(): string {
    return BaffleMapItem.imageURL;
  }

  public static readonly imageURL:string = "img/item/baffle.png";

  constructor(x:number, y:number) {
    super(new BaffleCollider(new Vector2D(x, y)));
  }
}

export class BaffleAlphaMapItem extends BaffleMapItem {
  get name(): MapItemNames {
    return BaffleAlphaMapItem.Name;
  }
  public static readonly Name:MapItemNames = "baffle-alpha";

}

export class BaffleBetaMapItem extends BaffleMapItem {
  get name(): MapItemNames {
    return BaffleBetaMapItem.Name;
  }
  public static readonly Name:MapItemNames = "baffle-beta";

}
