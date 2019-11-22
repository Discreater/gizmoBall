<template>
  <div class="tool-zone" :style="'pointer-events: ' + (currentMode=='LAYOUT' ? 'auto' : 'none')">
    <table class="tool-table" width="100%">
      <caption class="caption">工具栏</caption>
      <tr class="two-tool">
        <td >
          <img class="tool" src="img/tool/rotate.png" :height="length" :width="length"/>
        </td>
        <td >
          <img class="tool" src="img/tool/remove.png" :height="length" :width="length"/>
        </td>
      </tr>
      <tr>
        <td >
          <img class="tool" src="img/tool/zoom-in.png" :height="length" :width="length"/>
        </td>
        <td>
          <img class="tool" src="img/tool/zoom-out.png" :height="length" :width="length"/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import store from "@/store/index"

@Component
export default class ToolZone extends Vue {
  get currentMode() {
    return store.state.module1.currentMode;
  }
  length: number = 50;
}
</script>

<style lang="stylus" scoped>
.tool-zone{

  .tool{
    margin 5px
  }
}
</style>
