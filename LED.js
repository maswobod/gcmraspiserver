
module.exports = function LED(port){

	var leds = require('rpio');
	leds.open(port, leds.OUTPUT, leds.LOW);

	function trunOn(){
		leds.write(port, leds.HIGH);
	}

	function turnOff(){
		leds.write(port, leds.LOW);
	}
};

