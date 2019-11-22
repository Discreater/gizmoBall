import TSViews from "../views/TSViews"
import { ViewItem } from '@/types/gizmo';


export interface Module1State {
  useLightTheme: boolean,
  currentMode: 'LAYOUT' | 'PLAY',
  gridSize: number,
  currentItem: ViewItem | null
}

export default {
  state: {
    useLightTheme: true,
    currentMode: 'LAYOUT',
    gridSize: 10
  } as Module1State,
  mutations: {
    changeTheme(state: Module1State, useLight: boolean) {
      state.useLightTheme = useLight;
      let theme: string = useLight ? 'light' : 'dark';
      document.getElementById("app-skin")?.setAttribute("href", `skin/${theme}/skin.css`)
      TSViews.updateTitleTheme(useLight)
    },
    changeMode(state: Module1State, currentMode: 'LAYOUT' | 'PLAY') {
      state.currentMode = currentMode;
    },
    changeCurrentItem(state: Module1State, currentItem: ViewItem | null) {
      state.currentItem = currentItem;
    }
  },
  actions: {},
  modules: {}
} as const
