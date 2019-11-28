import { remote } from "electron";
import fs from "fs";
import util from "util"

interface FileOpenOption {
  filePath: string,
  data: string;
}

class FileSystem {

  public static open(): Promise<FileOpenOption> {
    return new Promise((resolve, reject) => {
      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),
        {
          title: "打开文件",
          filters: [{ name: 'GIZMO文件', extensions: ["gizmo"] }],
          properties: ["openFile", "promptToCreate"]
        },
        (filePaths) => {
          if (filePaths && filePaths[0]) {
            const readFile = util.promisify(fs.readFile);
            readFile(filePaths[0])
              .then((data) => resolve({
                filePath: filePaths[0],
                data: data.toString()
              }))
              .catch((err) => reject(err))
          }
        }
      )
    })
  }

  public static save(content: string, path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, content, err => {
        err ? reject(err) : resolve();
      })
    })
  }

  public static saveAs(content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      remote.dialog.showSaveDialog(
        remote.getCurrentWindow(),
        {
          title: "文件另存为",
          filters: [{ name: 'GIZMO文件', extensions: ["gizmo"] }]
        },
        (filename) => {
          if (filename) {
            FileSystem.save(content, filename)
              .then(res => resolve(filename))
              .catch(err => reject(err))
          }
        }
      )
    })
  }

}

export default FileSystem;
