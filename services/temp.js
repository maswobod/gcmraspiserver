//Temp Module
//Poti Module
var util = require('util');
var EventEmitter = require('events').EventEmitter;


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

const spawn = require('threads').spawn;
 
const thread = spawn(function(input, done) {
	// Everything we do here will be run in parallel in another execution context. 
	// Remember that this function will be executed in the thread's context, 
	// so you cannot reference any value of the surrounding code. 
	
	var adwandler = require('./adwandler');
	var database = require('./database');
//TODO: change with params
	adwandler.init( 23,19,21,24,5);
	database.init();

	//First measurement most time very different
	adwandler.getAnalogData();

	var anz = 3;

  	while(true){
		//Get avrage measurement
		sum = 0;
		for( var i = 0; i < anz; i++){
			var tmp = adwandler.getAnalogData();
			sum += tmp;
			sleep(500);
			
		}
		tmp_value = sum/anz;

		voltage = -0.003222*tmp_value+3.3;
		//Invert voltage gor temeprature
		var invVol = 3.3 - voltage;

		/*
		 * Every 10 Milivolt = 1 Celcius
		 */
		temperature = invVol*100;
		lower_bound = old_tmperature-0.5;
		upper_bound = old_tmperature+0.5;

		if (temperature < lower_bound || temperature > upper_bound) {
			var timestamp = new Date().toLocaleTimeString('en-GB', { hour: "numeric", 
                                             minute: "numeric"});

			database.addDataToDB("temp1",timestamp, temperature);
			console.log("Message Device: " + temperature);
		}
		old_tmperature = temperature;
	}
  done({ string : input.string, integer : parseInt(input.string) });
});

var temp_clk;
var temp_din;
var temp_dout;
var temp_cs;
var temp_channel;

/*
 * PUBLIC METHODS.
 */

temp.prototype.init = function(  clk, din, dout, cs, channel ){
	temp_clk = clk;
	temp_din = din;
	temp_dout = dout;
	temp_cs = cs;
	temp_channel = channel;
	
	TEMP();
};

temp.prototype.getTempData = function(){
	//Start thread that make measurements
	thread
	  .send({ string : '123' })
	  // The handlers come here: (none of them is mandatory) 
	  .on('error', function(error) {
	    console.error('Worker errored:', error);
	  })
	  .on('exit', function() {
	    console.log('Worker has been terminated.');
	  });
	
};

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
