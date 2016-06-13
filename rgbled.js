//RGB LED Module
var rpio = require('rpio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var RED;
var GREEN;
var BLUE;

// ---
// PUBLIC METHODS.
// ---

function rgbled()
{
	EventEmitter.call(this);
}
util.inherits(rgbled, EventEmitter);


rgbled.prototype.init = function( red, green, blue ){
	leds.open(red, leds.OUTPUT, leds.LOW); //Green
	leds.open(green, leds.OUTPUT, leds.LOW); //Blue
	leds.open(blue, leds.OUTPUT, leds.LOW); //Red

	RED = red;
	GREEN = green;
	BLUE = blue;
	LED();
};

rgbled.prototype.control = function(color){
	switch (color) {     
	    case "OFF":
	    	turnOff(RED);
	        turnOff(GREEN);
	        turnOff(BLUE);
	        break;
	    case "RED":
	    	turnOff(GREEN);
	      	turnOff(BLUE);
	      	turnOn(RED);
	    break;             
	    case "BLUE":
	      	turnOff(RED);
	      	turnOff(GREEN);
	      	turnOn(BLUE);
	    break;
	    case "GREEN":
	     	turnOff(RED);
	      	turnOff(BLUE);
	      	turnOn(GREEN);
	    break;
	    default:
	       console.log("Unknown Message")
	       break;
    }

}

// ---
// PRIVATE METHODS.
// ---

var turnOn = function(port){
	console.log("Turn On: " + port);
	rpio.write(port, rpio.HIGH);
};

var turnOff = function(port){
	console.log("Turn Off: " + port);
	rpio.write(port, rpio.LOW);
};

function LED(){
	console.log("RGB LED defined");
};

module.exports = new rgbled;