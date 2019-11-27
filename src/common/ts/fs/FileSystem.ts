import { remote } from "electron";
import fs from "fs";

class FileSystem {

  public static open(callback: (path: string, data: string)=>void) {
    remote.dialog.showOpenDialog(
      remote.getCurrentWindow(),
      {
        title: "打开文件",
        filters: [{ name: 'GIZMO文件', extensions: ["gizmo"] }],
        properties: ["openFile", "promptToCreate"]
      },
      (filePaths) => {
        if (filePaths && filePaths[0]) {
          const filePath = filePaths[0];
          fs.readFile(filePath, (err, data) => {
            if (err) {
              console.log('open file error:');
              console.log(err);
            } else {
              callback(filePath, data.toString());
            }
          })
        }
      }
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
      (filename) => {
        if (filename) {
          FileSystem.save(content, filename);
        }
      }
    )
  }

}

export default FileSystem;
