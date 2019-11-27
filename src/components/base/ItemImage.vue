<template>
  <img :class="cssClass" ref="img" :src="item.imgURL" width="35px" height="35px"
    :style="`position: absolute;top:${item.position.y}px;left:${item.position.x}px;transform: rotate(${rotation}deg)`"/>
</template>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { MapItem, isRotatable } from '../../common/ts/model/mapitems/MapItems';
import store from '@/store';

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
}
</script>

<style scoped>
.pick-box {
  border-color: #33FF00;
  border-width: 2px;
  border-style: solid;
}


</style>
