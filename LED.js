var leds = require('rpio');
var port;


var LED = function(port){
	this.port = port;
	leds.open(port, leds.OUTPUT, leds.LOW);
};

LED.prototype.trunOn = function{
	leds.write(port, leds.HIGH);
};

LED.prototype.trunOff = function{
	leds.write(port, leds.LOW);
}
