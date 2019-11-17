const child_process = require('child_process')

let key = 'REG QUERY HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v AppsUseLightTheme';
child_process.exec(key, (error, stdout, stderr) => {
  console.log('--error---:\n');
  console.log(error);
  console.log('--stdout--');
  console.log(parseInt(stdout.split(/\s+/)[4], 16));
  console.log('--stderr--');
  console.log(stderr);
})
