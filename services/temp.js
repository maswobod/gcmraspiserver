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

function temp()
{
	EventEmitter.call(this);
}
util.inherits(temp, EventEmitter);

/* 
 * Constants
 */

temp.anz = 3;

/*
 * PUBLIC METHODS.
 */

temp.prototype.init = function(  clk, din, dout, cs, channel ){
	adwandler.init( clk, din, dout, cs, channel);
	database.init();
	TEMP();
};

temp.prototype.getTempData = function(){
	while(true){
		//Get avrage measurement
		for( var i = 0; i < temp.anz; i++){
			var tmp = adwandler.getAnalogData();
			sum += tmp;
			sleep(500);
			
		}
		tmp_value = sum/temp.anz;

		voltage = -0.003222*tmp_value+3.3;
		//Invert voltage gor temeprature
		var invVol = 3.3 - voltage;

		/*
		 * Every 10 Milivolt = 1 Celcius
		 */
		temperature = invVol*100;
		lower_bound = old_tmperature-0.5;
		upper_bound = old_tmperature+0.5;

		if (temperature < lower_bound && temperature > upper_bound) {
			var timestamp = new Date().toLocaleTimeString('en-GB', { hour: "numeric", 
                                             minute: "numeric"});

			database.addDataToDB("temp1",timestamp, temperature);
			console.log("Message Server: " + temperature);
		}
		old_tmperature = temperature;
	}
}

/*
 * PRIVATE METHODS.
 */ 

function TEMP(){
	console.log("Poti defined");
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

module.exports = new temp;
