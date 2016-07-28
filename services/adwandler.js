/**********************************************************
 * Bachelor Thesis: Design Pattersn for IoT Systems
 * A/D Converter Control Module
 * Author: Martin Swoboda
 * Version: 280716
 ***********************************************************/
var rpio = require('rpio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var CLK_Pin; 
var DIN_Pin; 
var DOUT_Pin;  
var CS_Pin; 

function adwandler()
{
	EventEmitter.call(this);
}
util.inherits(adwandler, EventEmitter);

/*
 * PUBLIC METHODS.
 */
adwandler.prototype.init = function(converterAD){
	CLK_Pin = converterAD[0];
	DIN_Pin = converterAD[1];
	DOUT_Pin = converterAD[2];
	CS_Pin = converterAD[3];

	rpio.open(CLK_Pin, rpio.OUTPUT, rpio.LOW);
	rpio.open(DIN_Pin, rpio.OUTPUT, rpio.LOW);
	rpio.open(CS_Pin, rpio.OUTPUT, rpio.LOW);
	rpio.open(DOUT_Pin, rpio.INPUT);
};

adwandler.prototype.getAnalogData = function(channel){
	rpio.write(CS_Pin, rpio.HIGH);
	rpio.write(CS_Pin, rpio.LOW);
	rpio.write(CLK_Pin, rpio.HIGH);
	var pushcmd = channel;
	pushcmd |= 0b00011000;

	for (var i = 0; i < 5; i++) {
		if(pushcmd & 0b10000){
			rpio.write(DIN_Pin, rpio.HIGH);
		}else{
			rpio.write(DIN_Pin, rpio.LOW);
		}
		
		rpio.write(CLK_Pin, rpio.HIGH);
		rpio.write(CLK_Pin, rpio.LOW);
		pushcmd <<= 1;
	}

	var poti_channel_value = 0;

	for (var i = 0; i < 11; i++) {
		rpio.write(CLK_Pin, rpio.HIGH);
		rpio.write(CLK_Pin, rpio.LOW);

		poti_channel_value <<= 1;
		if(rpio.read(DOUT_Pin)){
			poti_channel_value |= 0x01;
		}

	}

	return poti_channel_value;
};

module.exports = new adwandler;
