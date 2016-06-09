var rpio = require('rpio');

rpio.open(29, rpio.INPUT);
rpio.open(31, rpio.INPUT);
console.log('Pin 29 is currently set ' + (rpio.read(29) ? 'high' : 'low'));
console.log('Pin 31 is currently set ' + (rpio.read(31) ? 'high' : 'low'));
rpio.sleep(5);
console.log('Pin 29 is currently set ' + (rpio.read(29) ? 'high' : 'low'));
console.log('Pin 31 is currently set ' + (rpio.read(31) ? 'high' : 'low'));