<template>
  <div class="mode-zone">
    <table class="mode-table" width="100%">
      <caption class="caption">模式栏</caption>
      <tr>
        <td class="mode-col" align="right">
          <img v-if="currentMode === 'LAYOUT'" src="img/mode/arrow.png" height="20">
        </td>
        <td align="left">
          <button @click="changeToLayoutMode" class="layout-button">布局模式</button>
        </td>
      </tr>
      <tr>
        <td align="right">
          <img v-if="currentMode === 'PLAY'" src="img/mode/arrow.png" height="20">
        </td>
        <td align="left">
          <button @click="changeToPlayMode" class="play-button">游玩模式</button>
        </td>
      </tr>
    </table>
    <span>GIZMO BALL</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ModeZone extends Vue {

  currentMode: 'LAYOUT' | 'PLAY' = 'LAYOUT';

  private changeToLayoutMode() {
    this.currentMode = 'LAYOUT'
  }

  private changeToPlayMode() {
    this.currentMode = 'PLAY'
  }
}
</script>

<style lang="stylus" scoped>
.mode-zone{
  height 100%
  display flex;
  justify-content space-between
  flex-direction column;

  .mode-table{
    .mode-col{
      width 60px
    }
    button {
      margin-top 15px
      margin-bottom 15px
      border-radius 10px
      width 111px
    }
  }
  span{
    font-family fantasy;
    font-size 50px;
    margin-bottom 10px;
  }
}
</style>
