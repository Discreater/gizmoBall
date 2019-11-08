const regedit = require('regedit')
const path = require('path')
function useLightTheme(resolve, reject) {
  const vbsDirectory = path.join('resources/regedit/vbs');
  console.log(regedit.setExternalVBSLocation(vbsDirectory));

  let key = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize';
  try {
    regedit.arch.list(key, (err, result) => {
      try {
        console.log(result);
        let a = result['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize'].values['AppsUseLightTheme'].value
        resolve(a == 1 ? true : false);
        console.log('success');
      } catch (error) {
        resolve(true);
      }
    })
  } catch (error) {
    console.log('error 2');
    resolve(true);
  }
}

let appUsesLightTheme = new Promise(useLightTheme)

export default appUsesLightTheme
