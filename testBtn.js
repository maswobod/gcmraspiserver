var Gpio = require('onoff').Gpio,
  button = new Gpio(6, 'in', 'both');

 button.watch(function(err, value) {
  console.log("SOmething happend");
});
