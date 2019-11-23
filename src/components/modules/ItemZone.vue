<template>
  <div class="item-zone" :style="'pointer-events: ' + (currentMode=='LAYOUT' ? 'auto' : 'none')">
    <table class="item-table" width="100%">
      <caption class="caption">组件栏</caption>
      <tr class="two-item" v-for="(items, rowIndex) in itemss" :key="rowIndex">
        <td v-for="(item, colIndex) in items" :key="colIndex">
          <label class="item">
            <input :checked="(rowIndex==0 && colIndex==0)" :id="'items'+(rowIndex*4+colIndex)"
                  type="radio" name="chooseItem" :value="item.value" v-model="currentItem"/>
            <img @dragstart="onDragstart(item, $event)" @dragend="onDragend(item, $event)" :src="item.img"
                  :draggable="item.value != 'select'" :height="length" :width="length"/>
          </label>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch
} from "vue-property-decorator";
import store from "@/store/index"
import { ViewItem, Gizmo, ItemType } from "@/types/gizmo";

@Component
export default class ItemZone extends Vue {

  get currentMode() {
    return store.state.module1.currentMode;
  }

  length: number = 48;
  currentItem: ItemType = 'select';

  @Watch('currentItem')
  onCurrentItemChanged(val: ItemType, oldVal: ItemType) {
    store.state.module1.currentItem = Gizmo.getViewItemByType(oldVal);
  }

  readonly itemss: ViewItem[][] = Gizmo.itemss

  onDragstart(item: ViewItem, event: DragEvent) {
    // 设定拖动数据
    // const itemString = JSON.stringify(item);
    // console.log(itemString);
    // event.dataTransfer!.setData("text/plain", itemString);
    // console.log(event.dataTransfer!.getData("text/plain"));
    // event.dataTransfer!.dropEffect = "copy";

    store.commit.changeDraggingItem(item);
  }

  onDragend(item: ViewItem, event: DragEvent) {
    store.commit.changeDraggingItem(null);
  }

}
</script>

<style lang="stylus" scoped>
.item-zone {
  height 100%
  background-color var(--color-side-bg)

  .item-table{

    .two-item{
      display flex
      justify-content center

      .item{
        display flex
        align-items  center
        margin 5px 10px
        img{
          margin-left: 5px
        }
      }
    }
  }
}
</style>

