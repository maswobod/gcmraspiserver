//Temp Module
//Poti Module
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var adwandler = require('./adwandler');
var database = require('./database');

var old_tmperature = 0;
var temperature = 0;
var voltage = 0;
var sum = 0;
var tmp_value = 0;
var lower_bound = 0;
var upper_bound = 0;

function poti()
{
	EventEmitter.call(this);
}
util.inherits(temp, EventEmitter);

/*
 * PUBLIC METHODS.
 */

temp.prototype.init = function(  clk, din, dout, cs, channel ){
	adwandler.init( clk, din, dout, cs, channel);
	database.init();
	getPotiData();
	TEMP();
};

/* 
 * Constants
 */

temp.anz = 3;

/*
 * PRIVATE METHODS.
 */ 

function getTempData(){
	while(true){
		//Get avrage measurement
		for( var i = 0; i < temp.anz; i++){
			setTimeout(function(){
				var tmp = adwandler.getPotiData();
				sum += tmp;
			}, 500);
		}
		tmp_value = sum/temp.anz;

		voltage = -0.003222*tmp_value+3.3;

		/*
		 * Every 10 Milivolt = 1 Celcius
		 */
		temperature = voltage*100;
		lower_bound = old_tmperature-0.5;
		upper_bound = old_tmperature+0.5;

		if (temperature < lower_bound || temperature > upper_bound) {
			var timestamp = new Date().toLocaleTimeString('en-GB', { hour: "numeric", 
                                             minute: "numeric"});

			database.addDataToDB("temp1",timestamp, temperature);
			console.log("Message Server: " + temperature);
		}
		old_tmperature = temperature;
	}
}

function TEMP(){
	console.log("Poti defined");
};

module.exports = new temp;
