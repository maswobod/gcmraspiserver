//Poti Module
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var adwandler = require('./adwandler');
var database = require('./database');
//To send Messages
var messageSend = require('./messageSender');

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
 * Constants
 */

poti.anz = 3;

/*
 * PUBLIC METHODS.
 */

poti.prototype.init = function(  clk, din, dout, cs, channel ){
	adwandler.init( clk, din, dout, cs, channel);
	database.init();
	messageSend.init('AIzaSyBAirrWt0-MbnVqR5l8YTIsc0foFYmHJPc');
	POTI();
};

poti.prototype.getPotiData = function(){
	//First measurement most time very different
	adwandler.getAnalogData();
	
	//Get avrage measurement
	sum = 0;
	for( var i = 0; i < poti.anz; i++){
		var adData = adwandler.getAnalogData();
		sum += adData;
		sleep(500);		
	}
	tmp_value = sum/poti.anz;

	voltage = -0.003222*tmp_value+3.3;

	lower_bound = old_voltage-0.3;
	upper_bound = old_voltage+0.3;

	if (voltage < lower_bound || voltage > upper_bound) {
		//Add Data to Database
		var currentdate = new Date();
		var timestamp = "Date: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " Time: "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();


		database.addDataToDB("poti1",timestamp, voltage);
		console.log("Message Server: " + voltage);
		var newPotiData = {Time: timestamp, Value: voltage};
		var send = {
          	potinew: []
          };
        send.potinew.push(newPotiData);
         messageSend.messageDevice("Thing Name here", "Noti title here", "New Poti data", send, "POTINEW");

	}
	old_voltage = voltage;
	
};

/*
 * PRIVATE METHODS.
 */ 

function POTI(){
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

module.exports = new poti;
