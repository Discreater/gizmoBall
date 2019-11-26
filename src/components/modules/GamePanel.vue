<template>
  <div class="game-panel">
    <div ref="gameGrid" @drop="onDrop" @dragover.prevent="onDragover" @dragenter.prevent class="game-grid" style="backgroundImage: url(img/grid.png)">
      <img v-for="(item, index) in items" :key="index" :src="item.imgURL" width="35px" height="35px" :style="`position: absolute;top:${item.position.y}px;left:${item.position.x}px`"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import store from "@/store/index";
import {
  ViewItem,
  MapElement,
  gridLength,
  gridLineLength
} from '@/types/gizmo';
import { itemMap, MapItem } from '../../common/ts/model/mapitems/MapItems';
import Controller from '../../common/ts/Controller';

@Component
export default class GamePanel extends Vue {

  $refs!: {
    gameGrid: HTMLElement
  }

  items: MapItem[] = [];

  private gridX!: number;
  private gridY!: number;

  mounted() {
    const p = this.$refs.gameGrid.getBoundingClientRect()
    this.gridX = p.left
    this.gridY = p.top
  }

  /**
   * 处理从组件栏拖动到网格上的dragover事件
   */
  onDragover(event: DragEvent) {
    // const itemString = event.dataTransfer!.getData("text/plain");
    const item = store.state.module1.draggingItem;
    if (item === null) {
      event.dataTransfer!.dropEffect = "none";
      return
    }
    // console.log(item.value);
    event.dataTransfer!.dropEffect = "copy";
  }

  /**
   * 处理从组件栏拖动到网格放下后的drop事件
   */
  onDrop(event: DragEvent) {
    console.log('You dropped something!');
    const item = store.state.module1.draggingItem;
    if (item === null || item.typeValue === 'select') {
      return
    }
    const element: MapElement = {
      ...item,
      x: event.clientX - this.gridX,
      y: event.clientY - this.gridY
    }
    this.formatPosition(element);
    // console.log(`拖到 ${element.x} + ${element.y}`);

    if (Controller.getInstance().createMapItem(item.typeValue, element.x, element.y)) {
      console.log(`--添加 ${item.typeValue} 成功`)
      this.items = Controller.getInstance().items;
    } else {
      console.log(`--添加 ${item.typeValue} 失败`);
    }
  }

  /**
   * 确定实际所放的位置
   */
  private formatPosition(element: MapElement) {
    const cellLength = gridLength + gridLineLength;
    element.x = Math.floor(element.x / cellLength) * cellLength;
    element.y = Math.floor(element.y / cellLength) * cellLength;
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
