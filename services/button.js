// Button Module
var port; 
var rpio = require('rpio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// ---
// PUBLIC METHODS.
// ---

function button()
{
	EventEmitter.call(this);
}
util.inherits(button, EventEmitter);


button.prototype.init = function( btn_port ){
	rpio.open(btn_port, rpio.INPUT, rpio.PULL_DOWN);
	port = btn_port;
	rpio.poll(btn_port, pollcb);

	BTN();
};

// ---
// PRIVATE METHODS.
// ---

function pollcb(pin){
   /*
    * Interrupts aren't supported by the underlying hardware, so events
    * may be missed during the 1ms poll window.  The best we can do is to
    * print the current state after a event is detected.
    */   
    var state = btns.read(pin) ? 'pressed' : 'released';
    console.log('Button event on P%d (button currently %s)', pin, state);
};

function BTN(){
	console.log("Button defined");
};

module.exports = new button;

