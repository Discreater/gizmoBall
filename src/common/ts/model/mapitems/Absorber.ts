import { PolygonMapItem } from './Polygon';
import { MapItemNames, ICollisible } from './MapItem';
import { Vector2D } from '../../util/Vector';
import { Ball } from './Ball';
import Controller from '../../Controller';
import { SquareCollider } from './Square';

export class AbsorberMapItem extends PolygonMapItem {
  public static readonly imageURL:string = "img/item/absorber.png";
  public static readonly Name:MapItemNames = "absorber";
  get name():MapItemNames {
    return AbsorberMapItem.Name;
  }
  get imgURL(): string {
    return AbsorberMapItem.imageURL;
  }
  constructor(x:number, y:number) {
    super(new SquareCollider(new Vector2D(x, y)));
  }
  public crashHandle(ball:ICollisible):void {
    if (ball instanceof Ball) {
      Controller.getInstance().handleAbsorb(ball.id);
    }
  }
}
