// fabonacci.js
const fabonacciCPP = require('./build/Release/addon');

function fabonacciNodeJS(n) {
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return fabonacciNodeJS(n - 1) + fabonacciNodeJS(n - 2);
}

function TestFabonnacci(func, env, n) {
  const start = (new Date()).getTime();
  const result = func(n);
  const end = (new Date()).getTime();
  console.log(`fabonacci(${n}) run in ${env} result is ${result}, cost time is ${end - start} ms.`);
}

TestFabonnacci(fabonacciNodeJS, 'Native Node.js', 40);
TestFabonnacci(fabonacciCPP, 'C++ Addon', 40);

