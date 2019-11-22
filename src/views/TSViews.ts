// import { Titlebar, Color, RGBA } from "../common/ts/titleBar";
import { Titlebar, Color, RGBA } from "custom-electron-titlebar";
import store from "@/store/index"
import {
  remote,
  Menu,
  MenuItem,
  MenuItemConstructorOptions
} from 'electron';


class TSViews {

  public static titlebar: Titlebar;
  public static readonly light: Color = new Color(new RGBA(221, 221, 221));
  public static readonly dark: Color = new Color(new RGBA(60, 60, 60));

  private static useLightTheme: boolean;

  /**
   * 创建标题栏，包括菜单栏
   */
  public static setTitleBar() {
    this.useLightTheme = store.state.module1.useLightTheme
    this.titlebar = new Titlebar({
      backgroundColor: this.useLightTheme ? this.light : this.dark,
      icon: "favicon.ico",
      maximizable: false
    })
    // console.log('use Light Theme? ' + this.useLightTheme);

    this.setTitleMenu();
  }

  /**
   * 更新标题栏主题
   * @param useLightTheme 是否使用亮色
   */
  public static updateTitleTheme(useLightTheme: boolean) {
    this.useLightTheme = useLightTheme;
    this.titlebar?.updateBackground(useLightTheme ? this.light : this.dark);
  }

  /**
   * 创建菜单栏
   */
  private static setTitleMenu() {
    // 菜单点击事件回调会使用到，所以事先声明
    let customMenu: Menu;

    // 菜单栏生成模板
    const fileMenuTemplate: MenuItemConstructorOptions = {
      label: '文件',
      role: 'fileMenu',
      submenu: [
        {
          label: "新建文件",
          accelerator: "Ctrl+N"
        },
        {
          label: "打开文件",
          accelerator: "Ctrl+O"
        },
        {
          type: "separator"
        },
        {
          label: "保存",
          accelerator: "Ctrl+S"
        },
        {
          label: "另存为",
          accelerator: "Ctrl+Shift+S"
        },
        {
          type: "separator"
        },
        {
          label: "退出",
          role: "quit",
          accelerator: "Alt+F4"
        }
      ]
    };
    const editMenuTemplate: MenuItemConstructorOptions = {
      label: "编辑",
      role: "editMenu",
      submenu: [
        {
          label: "撤销",
          role: "undo"
        },
        {
          label: "恢复",
          role: "redo"
        }
      ]
    }
    const viewMenuTemplate: MenuItemConstructorOptions = {
      label: "查看",
      role: "viewMenu",
      submenu: [
        {
          label: "主题",
          type: "normal",
          submenu: [
            {
              label: "亮色",
              type: "radio",
              click: (menuItem) => {
                menuItem.checked = true
                store.commit.changeTheme(true)
                this.titlebar.updateMenu(customMenu)
              }
            },
            {
              label: "暗色",
              type: "radio",
              click: (menuItem) => {
                menuItem.checked = true
                store.commit.changeTheme(false)
                this.titlebar.updateMenu(customMenu)
              }
            },
            {
              id: "2",
              label: "跟随系统" + (process.platform === 'win32' ? (this.useLightTheme ? "-亮色" : "-暗色") : "-暂不支持该系统"),
              type: "radio",
              enabled: process.platform === 'win32',
              click: (menuItem) => {
                menuItem.checked = true
                store.commit.changeTheme(remote.getGlobal('sharedObject').useLightTheme)
                this.titlebar.updateMenu(customMenu)
              },
              checked: true
            }
          ]
        }
      ]
    }
    const helpMenuTemplate: MenuItemConstructorOptions = {
      label: "帮助",
      submenu: [
        {
          label: "打开/关闭开发者工具",
          role: "toggledevtools",
          accelerator: "Ctrl+Shift+I"
        }
      ]
    }

    // 生成菜单栏
    customMenu = remote.Menu.buildFromTemplate([
      fileMenuTemplate,
      editMenuTemplate,
      viewMenuTemplate,
      helpMenuTemplate
    ])

    // 放入标题栏
    this.titlebar.updateMenu(customMenu);
  }
}

export default TSViews;
