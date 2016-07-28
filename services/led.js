/**********************************************************
 * Bachelor Thesis: Design Pattersn for IoT Systems
 * Light Emitting Diode Control Module
 * Author: Martin Swoboda
 * Version: 280716
 ***********************************************************/
var rpio = require('rpio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function led()
{
	EventEmitter.call(this);
}
util.inherits(led, EventEmitter);

/*
 * PUBLIC METHODS.
 */
led.prototype.init = function( led_port ){
	rpio.open(led_port, rpio.OUTPUT, rpio.LOW);
	LED();
};

led.prototype.turnOn = function(port){
	console.log("Turn On: " + port);
	rpio.write(port, rpio.HIGH);
};

led.prototype.turnOff = function(port){
	console.log("Turn Off: " + port);
	rpio.write(port, rpio.LOW);
};

/*
 * PRIVATE METHODS.
 */ 

function LED(){
	console.log("LED defined");
};

module.exports = new led;

