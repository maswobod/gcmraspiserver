
var port; 
var rpio = require('rpio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// ---
// PUBLIC METHODS.
// ---

/*
 * Event Emitter gloop.
 */
function led()
{
	EventEmitter.call(this);
}
util.inherits(led, EventEmitter);


led.prototype.init = function( port ){
	rpio.open(port, rpio.OUTPUT, rpio.LOW);
	LED();
};



led.prototype.trunOn = function(){
	console.log("Turn On: " + port);
	rpio.write(port, rpio.HIGH);
};

led.prototype.turnOff = function(){
	console.log("Turn Off: " + port);
	rpio.write(port, rpio.LOW);
};

// ---
// PRIVATE METHODS.
// ---

function LED(){
	console.log("LED defined");
};


