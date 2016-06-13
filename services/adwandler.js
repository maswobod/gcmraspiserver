//Poti Module
var rpio = require('rpio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var poti_channel;  // Analog/Digital-Channel
var CLK_Pin; // Clock bcm 11
var DIN_Pin; // Digital in bcm 10
var DOUT_Pin;  // Digital out bcm 9
var CS_Pin; //Chip-Select bcm 8

function adwandler()
{
	EventEmitter.call(this);
}
util.inherits(adwandler, EventEmitter);

// ---
// PUBLIC METHODS.
// ---

adwandler.prototype.init = function( clk, din, dout, cs, channel){
	CLK_Pin = clk;
	DIN_Pin = din;
	DOUT_Pin = dout;
	CS_Pin = cs;
	poti_channel = channel;

	rpio.open(CLK_Pin, rpio.OUTPUT, rpio.LOW);
	rpio.open(DIN_Pin, rpio.OUTPUT, rpio.LOW);
	rpio.open(CS_Pin, rpio.OUTPUT, rpio.LOW);
	rpio.open(DOUT_Pin, rpio.INPUT);
	
};

adwandler.prototype.getAnalogData = function(){
	rpio.write(CS_Pin, rpio.HIGH);
	rpio.write(CS_Pin, rpio.LOW);
	rpio.write(CLK_Pin, rpio.HIGH);
	var pushcmd = poti_channel;
	pushcmd |= 0b00011000;

	//Send Bits
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
}

module.exports = new adwandler;
