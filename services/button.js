// Button Module
var port; 
var rpio = require('rpio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

//To send Messages
var messageSend = require('./messageSender');
/*
 * PUBLIC METHODS.
 */

function button()
{
	EventEmitter.call(this);
}
util.inherits(button, EventEmitter);


button.prototype.init = function( btn_port ){
	port = btn_port;
    rpio.open(port, rpio.INPUT);
    messageSend.init('AIzaSyBAirrWt0-MbnVqR5l8YTIsc0foFYmHJPc');

	BTN();
};

/*
 * PRIVATE METHODS.
 */ 

button.prototype.checkIfPressed = function(){
    console.log('Pin '+ port + ' is currently set ' + (rpio.read(port) ? 'high' : 'low'));
};

function BTN(){
	console.log("Button defined");
};

module.exports = new button;

