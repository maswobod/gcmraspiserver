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
    rpio.open(port, rpio.INPUT, rpio.PULL_DOWN);
    messageSend.init('AIzaSyBAirrWt0-MbnVqR5l8YTIsc0foFYmHJPc');

    rpio.poll(pin, pollcb, rpio.POLL_HIGH);
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

function pollcb(cbpin)
{
    /*
     * It cannot be guaranteed that the current value of the pin is the
     * same that triggered the event, so the best we can do is notify the
     * user that an event happened and print what the value is currently
     * set to.
     *
     * Unless you are pressing the button faster than 1ms (the default
     * setInterval() loop which polls for events) this shouldn't be a
     * problem.
     */
    var state = rpio.read(cbpin) ? 'pressed' : 'released';
    console.log('Button event on P%d (button currently %s)', cbpin, state);

    /*
     * By default this program will run forever.  If you want to cancel the
     * poll after the first event and end the program, uncomment this line.
     */
    // rpio.poll(cbpin, null);
}

module.exports = new button;

