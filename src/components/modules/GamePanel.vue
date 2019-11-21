<template>
  <div class="game-panel">
    <div class="game-grid" style="backgroundImage: url(img/grid.png)">

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class GamePanel extends Vue {
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
  }
}
</style>
