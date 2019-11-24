import { remote } from "electron";
import fs from "fs";

class FileSystem {

  public static open() {
    remote.dialog.showOpenDialog(
      remote.getCurrentWindow(),
      {
        title: "打开文件",
        filters: [{ name: 'GIZMO文件', extensions: ["gizmo"] }]
      },
      (filePaths, bookmarks) => {}
    )
  }

  public static save(content: string, path: string) {
    fs.writeFile(path, content, err => {
      if (err) {
        console.log(`save file error: ${err}`);
      }
    })
  }

  public static saveAs(content: string) {
    remote.dialog.showSaveDialog(
      remote.getCurrentWindow(),
      {
        title: "文件另存为",
        filters: [{ name: 'GIZMO文件', extensions: ["gizmo"] }]
      },
      (filename, bookmark) => {
        if (filename) {
          FileSystem.save(content, filename);
        }
        console.log(`--filename: ${filename}`);
        console.log(`--bookmark: ${bookmark}`);
      }
    )
  }

}

export default FileSystem;