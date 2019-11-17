import child_process from "child_process"

class Util {

  /**
   * 通过注册表判断用户当前的主题色，仅限wnidows10
   */
  public static judgeTheme() {
    let key = 'REG QUERY HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v AppsUseLightTheme';
    child_process.exec(key, (error, stdout, stderr) => {
      // 默认使用亮色主题
      let useLightTheme: boolean = true;
      if (error) {
        console.log('-----back.ts: JudgeTheme failed');
        console.log(stderr);
      } else {
        useLightTheme = parseInt(stdout.split(/\s+/)[4], 16) == 0 ? false : true;
        console.log('-----use light theme ? ' + useLightTheme);
      }
      // 使用共享对象，渲染进程使用remote访问该对象获得值
      (global as any).sharedObject = {
        useLightTheme: useLightTheme
      }
    })
  }
}

export default Util;
