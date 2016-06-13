//Test injection

//LED Service Object
var LED = require('./LED').call( {}, 7 );

LED.turnOn();