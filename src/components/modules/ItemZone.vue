<template>
  <div class="item-zone">
    <table class="item-table" width="100%">
      <caption class="caption">组件栏</caption>
      <tr class="two-item" v-for="(items, rowIndex) in itemss" :key="rowIndex">
        <td v-for="(item, colIndex) in items" :key="colIndex">
          <label class="item">
            <input :checked="(rowIndex==0 && colIndex==0)" :id="'items'+(rowIndex*4+colIndex)" type="radio" name="chooseItem" :value="item.value"/>
            <img @dragstart="onDragstart(item, $event)" @dragend="onDragend(item, $event)" :src="item.img" :height="length" :width="length"/>
          </label>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { log } from 'util';

interface ViewItem {
  value: string,
  img: string
}

@Component
export default class ItemZone extends Vue {


  length: Number = 48;

  onDragstart(item: ViewItem, event: DragEvent) {}

  onDragend(item: ViewItem, event: DragEvent) {
    console.log(item);
    console.log(event.x);
    console.log(event.y);
  }

  sampleItem: ViewItem = {
    value: 'sample',
    img: "img/item/select.png"
  }
  selectItem: ViewItem = {
    value: 'select',
    img: "img/item/select.png"
  }
  ballItem: ViewItem = {
    value: 'ball',
    img: "img/item/ball.png"
  }
  absorberItem: ViewItem = {
    value: 'absorber',
    img: "img/item/absorber.png"
  }
  triangleItem: ViewItem = {
    value: 'triangle',
    img: 'img/item/triangle.png'
  }
  circleItem: ViewItem = {
    value: 'circle',
    img: 'img/item/circle.png'
  }
  squareItem: ViewItem = {
    value: 'square',
    img: 'img/item/square.png'
  }
  pipeItem: ViewItem = {
    value: 'pipe',
    img: 'img/item/pipe_normal.png'
  }
  pipeTurnedItem: ViewItem = {
    value: 'pipeTurned',
    img: 'img/item/pipe_turned.png'
  }
  baffleAlphaItem: ViewItem = {
    value: 'baffleAlpha',
    img: 'img/item/baffle-mid.png'
  }
  baffleBetaItem: ViewItem = {
    value: 'baffleBeta',
    img: 'img/item/baffle-mid.png'
  }
  sampleItems: ViewItem[] = [
    this.sampleItem,
    this.ballItem
  ]
  itemss: ViewItem[][] = [
    [this.selectItem, this.ballItem],
    [this.absorberItem, this.triangleItem],
    [this.circleItem, this.squareItem],
    [this.pipeItem, this.pipeTurnedItem],
    [this.baffleAlphaItem, this.baffleBetaItem]
  ]


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

