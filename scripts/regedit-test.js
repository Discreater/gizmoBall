const regedit = require('regedit')
const os = require('os')


platform = os.platform();
console.log(os.platform());
if (platform !== 'win32') {
  return
}
key = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize';
try {
  regedit.arch.list(key, (err, result) => {
    try {
      console.log(result[key].values['AppsUseLightTheme'].value);
    } catch (error) {
      console.log('error')
    }
  })
} catch (error) {
  console.log('error2');
}

