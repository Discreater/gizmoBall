<template>
  <div class="tool-zone" :style="'pointer-events: ' + (available ? 'auto' : 'none')">
    <table class="tool-table" width="100%">
      <caption class="caption">工具栏</caption>
      <tr class="two-tool">
        <td >
          <img class="tool" src="img/tool/rotate.png" @click="rotate" :height="length" :width="length"/>
        </td>
        <td >
          <img class="tool" src="img/tool/remove.png" @click="remove" :height="length" :width="length"/>
        </td>
      </tr>
      <tr>
        <td >
          <img class="tool" src="img/tool/zoom-in.png" @click="zoomin" :height="length" :width="length"/>
        </td>
        <td>
          <img class="tool" src="img/tool/zoom-out.png" @click="zoomout" :height="length" :width="length"/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import store from "@/store/index"
import Controller from '../../common/ts/Controller';
import { MapItem } from '../../common/ts/model/mapitems/MapItems';

@Component
export default class ToolZone extends Vue {
  get available(): boolean {
    const m = store.state.module1;
    return m.currentMode === 'LAYOUT' && m.panelCurrentItem != null;
  }
  length: number = 50;
  get currentItem(): MapItem | null {
    return store.state.module1.panelCurrentItem;
  }
  rotate() {
    if (this.available && this.currentItem) {
      Controller.getInstance().handleRotate(this.currentItem.id);
    }
  }
  remove() {
    if (this.available && this.currentItem) {
      Controller.getInstance().handleDeleteItem(this.currentItem.id);
    }
  }
  zoomin() {
    if (this.available && this.currentItem) {
      Controller.getInstance().handleZoomIn(this.currentItem.id);
    }
  }
  zoomout() {
    if (this.available && this.currentItem) {
      Controller.getInstance().handleZoomOut(this.currentItem.id);
    }
  }
}
</script>

<style lang="stylus" scoped>
.tool-zone{

  .tool{
    margin 5px
  }
}
</style>
