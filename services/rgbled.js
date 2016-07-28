/**********************************************************
 * Bachelor Thesis: Design Pattersn for IoT Systems
 * RGB Light Emitting Diode Control Module
 * Author: Martin Swoboda
 * Version: 280716
 ***********************************************************/
var rpio = require('rpio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function rgbled()
{
	EventEmitter.call(this);
}
util.inherits(rgbled, EventEmitter);

/*
 * Init the RGB Ports
 */
rgbled.prototype.init = function( rgbArray){

	var red = rgbArray[0];
	var green = rgbArray[1];
	var blue = rgbArray[2];

	rpio.open(red, rpio.OUTPUT, rpio.LOW); //Green
	rpio.open(green, rpio.OUTPUT, rpio.LOW); //Blue
	rpio.open(blue, rpio.OUTPUT, rpio.LOW); //Red

	LED();
};

/*
 * Change the Colors of the RGB of turn it off
 */
rgbled.prototype.control = function(color, rgbArray){
	var RED = rgbArray[0];
	var GREEN = rgbArray[1];
	var BLUE = rgbArray[2];

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

/*
* PRIVATE METHODS.
*/ 
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