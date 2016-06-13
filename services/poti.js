//Poti Module
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var adwandler = require('./adwandler');
var database = require('./database');

var old_voltage = 0;
var voltage = 0;
var sum = 0;
var tmp_value = 0;
var lower_bound = 0;
var upper_bound = 0;

function poti()
{
	EventEmitter.call(this);
}
util.inherits(poti, EventEmitter);

/*
 * PUBLIC METHODS.
 */

poti.prototype.init = function(  clk, din, dout, cs, channel ){
	adwandler.init( clk, din, dout, cs, channel);
	database.init();
	POTI();
};

/* 
 * Constants
 */

poti.anz = 3;

/*
 * PRIVATE METHODS.
 */ 

poti.prototype.getPotiData = function(){
	while(true){
		//Get avrage measurement
		for( var i = 0; i < poti.anz; i++){
			setTimeout(function(){
				var tmp = adwandler.getPotiData();
				sum += tmp;
			}, 500);
		}
		tmp_value = sum/poti.anz;

		voltage = -0.003222*tmp_value+3.3;

		lower_bound = old_voltage-0.3;
		upper_bound = old_voltage+0.3;

		if (voltage < lower_bound || voltage > upper_bound) {
			//Add Data to Database
			var timestamp = new Date().toLocaleTimeString('en-GB', { hour: "numeric", 
                                             minute: "numeric"});
			database.addDataToDB("poti1",timestamp, voltage);
			console.log("Message Server: " + voltage);
		}
		old_voltage = voltage;
	}
}

function POTI(){
	console.log("Poti defined");
};

module.exports = new poti;
