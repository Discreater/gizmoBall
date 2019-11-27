import TSViews from "../views/TSViews"
import { ViewItem, Gizmo } from '@/types/gizmo';
import { MapItem } from "@/common/ts/model/mapitems/MapItems"


export interface Module1State {
  useLightTheme: boolean,
  currentMode: 'LAYOUT' | 'PLAY',
  gridSize: number,
  draggingItem: ViewItem | null,
  toolZoneCurrentItem: ViewItem,
  panelCurrentItem: MapItem | null
}

export default {
  state: {
    useLightTheme: true,
    currentMode: 'LAYOUT',
    gridSize: 10,
    draggingItem: null,
    toolZoneCurrentItem: Gizmo.selectItem,
    panelCurrentItem: null
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
    changeToolZoneCurrentItem(state: Module1State, toolZoneCurrentItem: ViewItem) {
      state.toolZoneCurrentItem = toolZoneCurrentItem;
    },
    changePanelCurrentItem(state: Module1State, panelCurrentItem: MapItem | null) {
      state.panelCurrentItem = panelCurrentItem;
    }
  },
  actions: {},
  modules: {}
} as const
