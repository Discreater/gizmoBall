<template>
  <div class="game-panel">
    <div ref="gameGrid" @click="onPanelClick()" @drop="onDrop" @dragover.prevent="onDragover" @dragenter.prevent class="game-grid" style="backgroundImage: url(img/grid.png)">
      <ItemImage v-for="(item, index) in items" :key="index" :item="item" :selected="currentItemId === item.id"
        @click.native.stop="onImgClick(item)">
      </ItemImage>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ItemImage from "@/components/base/ItemImage.vue";
import store from "@/store/index";
import {
  ViewItem,
  MapElement,
  isViewItem,
  Gizmo
} from '@/types/gizmo';
import { itemMap, MapItem } from '../../common/ts/model/mapitems/MapItems';
import Controller from '../../common/ts/Controller';
import { Vector2D } from '../../common/ts/util/Vector';

@Component({
  components: {
    ItemImage
  }
})
export default class GamePanel extends Vue {

  $refs!: {
    gameGrid: HTMLElement
  }

  items: MapItem[] = [];

  get currentItemId(): number {
    if (store.state.module1.currentMode === 'LAYOUT' && store.state.module1.panelCurrentItem) {
      return store.state.module1.panelCurrentItem.id;
    } else {
      return 0;
    }
  }

  private gridX!: number;
  private gridY!: number;

  mounted() {
    const p = this.$refs.gameGrid.getBoundingClientRect()
    this.gridX = p.left
    this.gridY = p.top
    setInterval(() => {
      this.items = Controller.getInstance().items;
    }, 100)
  }

  /**
   * 点击空白区域
   */
  onPanelClick() {
    store.commit.changePanelCurrentItem(null);
  }

  /**
   * 点击图片（item）
   */
  onImgClick(item: MapItem) {
    const m = store.state.module1;
    if (m.toolZoneCurrentItem.typeValue === 'select' && m.currentMode === 'LAYOUT') {
      store.commit.changePanelCurrentItem(item);
    }
  }

  /**
   * 处理从组件栏拖动到网格上的dragover事件
   */
  onDragover(event: DragEvent) {
    const item = store.state.module1.draggingItem;
    if (item === null) {
      event.dataTransfer!.dropEffect = "none";
    } else if (isViewItem(item)) {
      event.dataTransfer!.dropEffect = "copy";
    } else if (item instanceof MapItem) {
      event.dataTransfer!.dropEffect = "move";
    }
  }

  /**
   * 处理从组件栏拖动到网格放下后的drop事件
   */
  onDrop(event: DragEvent) {
    // console.log('You dropped something!');
    console.log("drop");
    console.log(event);
    const item = store.state.module1.draggingItem;
    if (item === null) {
      return
    }
    const offset = store.state.module1.draggingItemOffset;
    const position = new Vector2D(event.clientX - this.gridX - offset.x, event.clientY - this.gridY - offset.y);
    if (isViewItem(item) && item.typeValue !== 'select') {
      this.formatPosition(position, 'floor');
      Controller.getInstance().createMapItem(item.typeValue, position.x, position.y)
    } else if (item instanceof MapItem) {
      this.formatPosition(position, 'round')
      Controller.getInstance().handleDraggingItem(item.id, position);
    }
  }

  /**
   * 确定实际所放的位置
   */
  private formatPosition(position: Vector2D, options: 'round' | 'floor') {
    const cellLength = Gizmo.gridLength + Gizmo.gridLineLength;
    if (options == 'round') {
      // 适用于从item zone拖放
      position.x = Math.round(position.x / cellLength) * cellLength;
      position.y = Math.round(position.y / cellLength) * cellLength;
    } else {
      // 适用于从game panel拖放
      position.x = Math.floor(position.x / cellLength) * cellLength;
      position.y = Math.floor(position.y / cellLength) * cellLength;
    }
  }
}
</script>

<style lang="stylus" scoped>
.game-panel{
  display flex;
  justify-content center;
  align-items center;
  height 100%
  width 100%

  .game-grid{
    height 719px;
    width 719px;
    border inset;
    position:relative;
  }
}
</style>
