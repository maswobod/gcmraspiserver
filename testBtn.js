var Gpio = require('onoff').Gpio,
  led = new Gpio(4, 'out'),
  button = new Gpio(5, 'in', 'both');

button.watch(function(err, value) {
  led.writeSync(value);
});

process.on('SIGINT', function () {
  led.unexport();
  button.unexport();
});