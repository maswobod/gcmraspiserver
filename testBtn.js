var Gpio = require('onoff').Gpio,
  button = new Gpio(5, 'in', 'both');

button.watch(function(err, value) {
  console.log(value); 
});

process.on('SIGINT', function () {
  button.unexport();
});