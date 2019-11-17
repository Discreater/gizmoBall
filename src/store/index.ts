import Vue from "vue";
import Vuex from "vuex";
import TSViews from "../views/TSViews"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    useLightTheme: true
  },
  mutations: {
    changeTheme(state, useLight: boolean) {
      state.useLightTheme = useLight;
      let theme: string = useLight ? 'light' : 'dark';
      document.getElementById("app-skin")?.setAttribute("href", `skin/${theme}/skin.css`)
      TSViews.updateTitleTheme(useLight)
    }
  },
  actions: {},
  modules: {}
});
