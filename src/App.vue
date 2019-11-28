<template>
  <div id="app" ref="app">
    <Home></Home>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Home from '@/views/Home.vue'
import TSViews from '@/views/TSViews'

@Component({
  components: {
    Home
  }
})
export default class HelloWorld extends Vue {

  $refs!: {
    app: HTMLElement
  }

  mounted() {
    this.setAppSize();
    TSViews.bindKey();
  }

  private setAppSize() {
    this.$refs.app.style.height = `${window.innerHeight - 30}px`;
    this.$refs.app.style.width = `${window.innerWidth}px`;
  }
}
</script>

<style lang="stylus">
body {
  background: var(--color-bg)
  color: var(--color-text)
  user-select none
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text)
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: var(--color-text)

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.caption{
  background-color var(--color-caption-bg)
  color var(--color-caption-text)
}

</style>
