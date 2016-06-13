
var port; 
var leds = require('rpio');

function init( port ){
	leds.open(port, leds.OUTPUT, leds.LOW);
	return( LED() );
};

// ---
// PUBLIC METHODS.
// ---

function trunOn(){
	console.log("Turn On: " + port);
	leds.write(port, leds.HIGH);
};

function turnOff(){
	console.log("Turn Off: " + port);
	leds.write(port, leds.LOW);
};

// ---
// PRIVATE METHODS.
// ---

function LED(){
	console.log("LED defined");
};


