import child_process from "child_process"

/**
 * TODO 发送消息至渲染进程
 */

class Util {
  public static judgeTheme() {
    if (process.platform == 'win32') {
      let key = 'REG QUERY HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v AppsUseLightTheme';
      child_process.exec(key, (error, stdout, stderr) => {
        if (error) {
          console.log('-----back.ts: JudgeTheme failed');
          console.log(error);
        } else {
          let useLightTheme = parseInt(stdout.split(/\s+/)[4], 16) == 0 ? false : true;
          console.log(useLightTheme);
        }
      })
    }
  }
}

export default Util;