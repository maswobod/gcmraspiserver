
module.exports = function LEDFactory( port ){

	var leds = require('rpio');
	leds.open(port, leds.OUTPUT, leds.LOW);

	return( LED );

	// ---
    // PUBLIC METHODS.
    // ---

	function trunOn(){
		leds.write(port, leds.HIGH);
	}

	function turnOff(){
		leds.write(port, leds.LOW);
	}

	// ---
    // PRIVATE METHODS.
    // ---

	function LED(){
		console.log("LED defined");
	}
};

