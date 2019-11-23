<template>
  <div class="game-panel">
    <div ref="gameGrid" @drop="onDrop" @dragover.prevent="onDragover" @dragenter.prevent class="game-grid" style="backgroundImage: url(img/grid.png)">
      <img v-for="(element, index) in elements" :key="index" :src="element.img" width="35px" height="35px" :style="`position: absolute;top:${element.y}px;left:${element.x}px`"/>
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

@Component
export default class GamePanel extends Vue {

  $refs!: {
    gameGrid: HTMLElement
  }

  elements: MapElement[] = [];

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
    if (item === null) {
      return
    }

    const element: MapElement = {
      ...item,
      x: event.clientX - this.gridX,
      y: event.clientY - this.gridY
    }
    this.formatPosition(element);
    console.log(element.x + " + " + element.y);

    this.elements.push(element);
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
