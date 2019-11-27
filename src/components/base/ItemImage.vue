<template>
  <img @dragstart="onDragstart($event)" @dragend="onDragend()" :class="cssClass"
    ref="img" :src="item.imgURL" :width="`${size}px`" :height="`${size}px`" :draggable="imageDraggable"
    :style="`position: absolute;top:${item.position.y}px;left:${item.position.x}px;transform: rotate(${rotation}deg)`"/>
</template>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  MapItem,
  isRotatable,
  isZoomable
} from '../../common/ts/model/mapitems/MapItems';
import store from '@/store';
import { Vector2D } from '../../common/ts/util/Vector';
import { Gizmo } from "@/types/gizmo"

@Component
export default class ItemImage extends Vue {
  @Prop() private item!: MapItem;
  @Prop() private selected!: boolean;

  $refs!: {
    img: HTMLElement
  }

  get cssClass(): string {
    return this.selected ? "pick-box" : '';
  }

  get rotation(): number {
    if (isRotatable(this.item)) {
      return this.item.rotation * 90;
    }
    return 0;
  }

  private readonly defaultSize: number = Gizmo.gridLength + Gizmo.gridLineLength;

  get size(): number {
    let result: number = this.defaultSize - 1;
    if (isZoomable(this.item)) {
      result = this.item.zoom * (this.defaultSize) - 1;
    }
    return result;
  }

  get imageDraggable(): boolean {
    const m = store.state.module1;
    if (m.currentMode == 'LAYOUT' && m.toolZoneCurrentItem.typeValue == 'select') {
      return true;
    }
    return false;
  }

  onDragstart(event: DragEvent) {
    store.commit.changeDraggingItemOffset(new Vector2D(event.offsetX, event.offsetY));
    store.commit.changeDraggingItem(this.item);
  }

  onDragend() {
    store.commit.changeDraggingItem(null);
  }

}
</script>

<style scoped>
.pick-box {
  border-color: #33FF00;
  border-width: 2px;
  border-style: solid;
}


</style>
