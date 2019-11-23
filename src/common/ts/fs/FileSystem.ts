import { remote } from "electron"

class FileSystem {
  public static saveAs(content: string) {
    remote.dialog.showSaveDialog(
      remote.getCurrentWindow(),
      {
        title: "文件另存为",
        filters: [{ name: 'GIZMO文件', extensions: ["gizmo"] }]
      }
    )
  }
}

export default FileSystem;
