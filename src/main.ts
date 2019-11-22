import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import TSViews from "./views/TSViews"
import { remote } from "electron";

Vue.config.productionTip = false;

init()

new Vue({
  router,
  store: store.original,
  render: h => h(App)
}).$mount("#app")


function init() {
  let useLightTheme: boolean = remote.getGlobal('sharedObject').useLightTheme
  store.commit.changeTheme(useLightTheme)
  TSViews.setTitleBar()
}
