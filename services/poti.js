//Poti Module
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var adwandler = ('adwandler');

var old_voltage = 0;
var voltage = 0;
var sum = 0;
var tmp_value = 0;
var lower_bound = 0;
var upper_bound = 0;

// ---
// PUBLIC METHODS.
// ---

function poti()
{
	EventEmitter.call(this);
}
util.inherits(poti, EventEmitter);


poti.prototype.init = function(  clk, din, dout, cs, channel ){
	adwandler.init( clk, din, dout, cs, channel);
	getPotiData();
	POTI();
};

/*
 * Constants
 */
poti.anz = 3;

// ---
// PRIVATE METHODS.
// ---

function getPotiData(){
	while(true){
		//Get avrage measurement
		for( int i = 0; i < anz; i++){
			setTimeout(function(){
				var tmp = adwandler.getPotiData();
				sum += tmp;
			}, 500);
		}
		tmp_value = sum/anz;

		voltage = -0.003222*tmp_value+3.3;

		lower_bound = old_voltage-0.3;
		upper_bound = old_voltage+0.3;

		if (voltage < lower_bound || voltage > upper_bound) {
			console.log("MEssage Server");
		}
	}
}

function POTI(){
	console.log("Poti defined");
};

module.exports = new poti;
