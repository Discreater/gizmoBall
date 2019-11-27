import { MapItem } from "@/common/ts/model/mapitems/MapItems";
import { Gizmo, ViewItem } from '@/types/gizmo';
import TSViews from "@/views/TSViews";
import { Vector2D } from '@/common/ts/util/Vector';
import { stat } from 'fs';

export interface Module1State {
  useLightTheme: boolean,
  currentMode: 'LAYOUT' | 'PLAY',
  draggingItem: MapItem | ViewItem | null,
  draggingItemOffset: Vector2D,
  toolZoneCurrentItem: ViewItem,
  panelCurrentItem: MapItem | null
}

export default {
  state: {
    useLightTheme: true,
    currentMode: 'LAYOUT',
    draggingItem: null,
    draggingItemOffset: new Vector2D(0, 0),
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
    changeDraggingItem(state: Module1State, draggingItem: MapItem | ViewItem | null) {
      state.draggingItem = draggingItem;
    },
    changeDraggingItemOffset(state: Module1State, draggingItemOffset: Vector2D) {
      state.draggingItemOffset = draggingItemOffset;
    },
    changeToolZoneCurrentItem(state: Module1State, toolZoneCurrentItem: ViewItem) {
      state.toolZoneCurrentItem = toolZoneCurrentItem;
      if (toolZoneCurrentItem.typeValue !== 'select') {
        state.panelCurrentItem == null;
      }
    },
    changePanelCurrentItem(state: Module1State, panelCurrentItem: MapItem | null) {
      state.panelCurrentItem = panelCurrentItem;
    }
  },
  actions: {},
  modules: {}
} as const
