import TSViews from "../views/TSViews"
import { ViewItem, Gizmo } from '@/types/gizmo';


export interface Module1State {
  useLightTheme: boolean,
  currentMode: 'LAYOUT' | 'PLAY',
  gridSize: number,
  draggingItem: ViewItem | null,
  currentItem: ViewItem
}

export default {
  state: {
    useLightTheme: true,
    currentMode: 'LAYOUT',
    gridSize: 10,
    draggingItem: null,
    currentItem: Gizmo.selectItem
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
    changeDraggingItem(state: Module1State, draggingItem: ViewItem | null) {
      state.draggingItem = draggingItem;
    },
    changeCurrentItem(state: Module1State, currentItem: ViewItem) {
      state.currentItem = currentItem;
    }
  },
  actions: {},
  modules: {}
} as const
