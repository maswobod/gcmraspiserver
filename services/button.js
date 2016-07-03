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
	rpio.open(btn_port, rpio.INPUT, rpio.PULL_DOWN);
	port = btn_port;

    messageSend.init('AIzaSyBAirrWt0-MbnVqR5l8YTIsc0foFYmHJPc');

	BTN();
};

/*
 * PRIVATE METHODS.
 */ 

button.prototype.checkIfPressed = function(){
    gpio.read(port, function(err, value) {
    if(err) throw err;
    console.log(value); // The current state of the pin
});

};

function BTN(){
	console.log("Button defined");
};

module.exports = new button;

