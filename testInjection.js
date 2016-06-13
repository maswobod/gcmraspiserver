//Test injection

//LED Service Object
var port = 7;
var LED = require('./LED');

LED.init(port);
LED.turnOn();