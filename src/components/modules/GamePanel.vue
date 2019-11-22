<template>
  <div class="game-panel">
    <div ref="gameGrid" @drop="onDrop" @dragover.prevent="onDragover" @dragenter.prevent class="game-grid" style="backgroundImage: url(img/grid.png)">
      <img v-for="(element, index) in elements" :key="index" :src="element.img" width="35px" height="35px" :style="`position:static;top:${element.y}px;left:${element.x}px`"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import store from "@/store/index";
import { ViewItem, MapElement } from '../../types/gizmo';

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
    console.log(p);
  }

  onDragover(event: DragEvent) {
    // const itemString = event.dataTransfer!.getData("text/plain");
    const item = store.state.module1.currentItem;
    if (item === null) {
      event.dataTransfer!.dropEffect = "none";
      return
    }
    // console.log(item.value);
    event.dataTransfer!.dropEffect = "copy";
  }

  onDrop(event: DragEvent) {
    console.log('You dropped something!');
    const item = store.state.module1.currentItem;
    if (item === null) {
      return
    }
    let element = {
      ...item,
      x: event.clientX - this.gridX,
      y: event.clientY - this.gridY
    }
    console.log(element.x + " + " + element.y);

    this.elements.push(element);
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
