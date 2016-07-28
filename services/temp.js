/**********************************************************
 * Bachelor Thesis: Design Pattersn for IoT Systems
 * Temperature Control Module
 * Author: Martin Swoboda
 * Version: 280716
 ***********************************************************/
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var adwandler = require('./adwandler');
var database = require('./database');
//To send Messages
var messageSend = require('./messageSender');

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
temp.prototype.init = function(converterAD, sendKey){
	adwandler.init(converterAD);
	database.init();
	messageSend.init(sendKey);
	
	TEMP();
};

temp.prototype.getTempData = function(channel){
	//First measurement most time very different
	adwandler.getAnalogData(channel);

	//Get avrage measurement
	sum = 0;
	for( var i = 0; i < temp.anz; i++){
		var tmp = adwandler.getAnalogData(channel);
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
	lower_bound = old_tmperature-0.3;
	upper_bound = old_tmperature+0.3;

	console.log(temperature);
	if (temperature < lower_bound || temperature > upper_bound) {
		var currentdate = new Date();
		var timestamp = "Date: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " Time: "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();


		database.addDataToDB("temp1",timestamp, temperature);
		console.log("Message Device: " + temperature);
		var newTempData = {Time: timestamp, Value: temperature};
		var send = {
          	tempnew: []
          };
        send.tempnew.push(newTempData);

		messageSend.messageDevice("Thing Name here", "Noti title here", "New Temp data", send, "TEMPNEW" );
		
	}
	old_tmperature = temperature;
};

/*
 * PRIVATE METHODS.
 */ 

function TEMP(){
	console.log("Temp defined");
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};

module.exports = new temp;