/**********************************************************
 * Bachelor Thesis: Design Pattersn for IoT Systems
 * Prototype Thing Main Script
 * Author: Martin Swoboda
 * Version: 280716
 ***********************************************************/

/*
 * Server API Key for Google Cloud Messaging
 */
var ApiKey = 'AIzaSyBAirrWt0-MbnVqR5l8YTIsc0foFYmHJPc'; 

/*
 * Database Control Module
 */
var database = require('./services/database');
database.init();

/*
 * Array of all Devices listening to this Thing
 * Devices added and removed automatically
 */ 
var clients = [];

/*
 * Module to recive Messages from Devices
 */
var xmpp = require('node-xmpp-client');
 
/*
 * Set node-xmpp options.
 * Replace with your projectID in the jid and your API key in the password
 * The key settings for CCS are the last two to force SSL and Plain SASL auth.
 */
var options = {
  type: 'client',
  jid: '508133522449@gcm.googleapis.com',
  password: ApiKey,
  port: 5235,
  host: 'gcm.googleapis.com',
  legacySSL: true,
  preferredSaslMechanism : 'PLAIN'
};

/*
 * Message sender to send messages to the Device
 */ 
var messageSend = require('./services/messageSender');
messageSend.init(ApiKey);

/*
 * All displayed Modules must be in this array
 * Push like this: {'TYPE' : 'NAME'}
 */
var modules = {
	modules: []
	};

/*
 * LED Control Module
 */
var LED = require('./services/led');
/*
 * Init the Port of the LED and add to modules array
 */
var led1 = 7;
LED.init(led1);
modules.modules.push({'LED' : 'Licht1'});

/*
 * RGB LED Control Module
 */
var RGBLED = require('./services/rgbled');
var rgb1 = [15,13,11];
RGBLED.init(rgb1);
modules.modules.push({'RGBLED' : 'Licht20'});


/*
 * Button Control
 * Cauntion: HERE BCM 
 * Port 29 gpio 5 & Port 31 gpio 6
 */
var Gpio = require('onoff').Gpio,
  button = new Gpio(5, 'in', 'rising'),
  button2 = new Gpio(6, 'in', 'rising');

button.watch(function(err, value) {
  console.log('btn1 pushed'); 
  messageSend.messageDevice("Prototype", "Button Pushed", "Button 1 was pushed", null, null);
});

button2.watch(function(err, value) {
  console.log('btn2 pushed'); 
  messageSend.messageDevice("Prototype", "Button Pushed", "Button 2 was pushed", null, null);
});

/*
 * Poti Control Module
 * Init like this:
 * var CLK_Pin = 23; // Clock bcm 11
 * var DIN_Pin = 19; // Digital in bcm 10
 * var DOUT_Pin = 21;  // Digital out bcm 9
 * var CS_Pin = 24; //Chip-Select bcm 8
 */
var poti = require('./services/poti');
var converterAD = [23,19,21,24];
// Set a interval to check the Data: Here every 30 sec
var interval = 30000; 
 // The Channel of the Poti in the Module
var poti1 = 7;
poti.init(converterAD, ApiKey);
setInterval(function() {
	console.log("Check for Poti Data");
	poti.getPotiData(poti1); 
}, interval);
modules.modules.push({'POTI' : 'Poti1'});

/*
 * Example of Temperature 
var temp = require('./services/temp');
temp.init(converterAD,ApiKey);
var tmp1 = 5;
setInterval(function() {
	console.log("Check for Temp Data");
	temp.getTempData(tmp1);
}, 50000);
modules.modules.push({"TEMP" : "Temperatur"});
*/

console.log('creating xmpp app');

var cl = new xmpp.Client(options);
cl.on('online',
  function() {
    console.log("online");
  });

cl.on('stanza',
  function(stanza) {
    if (stanza.is('message') &&
        stanza.attrs.type !== 'error') {

      console.log("Message received");
      
      //Message format as per here: https://developer.android.com/google/gcm/ccs.html#upstream
      var messageData = JSON.parse(stanza.getChildText("gcm"));

      console.log("From: " + messageData.from);
      console.log("Message: " + messageData.data.message);

      if (messageData && messageData.message_type != "ack" && messageData.message_type != "nack") {

        var ackMsg = new xmpp.Element('message').c('gcm', { xmlns: 'google:mobile:data' }).t(JSON.stringify({
          "to":messageData.from,
          "message_id": messageData.message_id,
          "message_type":"ack"
        }));
        //send back the ack.
        cl.send(ackMsg);
        console.log("Sent ack");

        //check if regToken is in Reg tokens
        var msgRegToken = messageData.from;
        /*
		 * if msgRegToken is not in reg tokes than add it to the 
		 * tokens an send messega to device with modules used
         */
        if (!(contains(messageSend.getRegTokens(),msgRegToken))) {
        	console.log("Add Reg Token & send all modules");
        	addObservable(msgRegToken);
        	messageSend.messageDevice("Thing Name here", "Noti title here", "Hallo form new Thing", modules, "Modules");
        }else{
        	console.log("Already in RegTokens");
        };

        handleObservableMessage(messageData.data.message);
        
      } else {
        //Need to do something more here for a nack.
        console.log("message was an ack or nack...discarding");
      }

    } else {
      console.log("error");
      console.log(stanza)
    }

  });

cl.on('error',
 function(e) {
   console.log("Error occured:");
   console.error(e);
   console.error(e.children);
   gpio.destroy()
});

/*
 * Unexport Buttons again
 */
process.on('SIGINT', function () {
  button.unexport();
  button2.unexport();
});

var contains = function(a, obj){
	var i = a.length;
	    while (i--) {
	       if (a[i] === obj) {
	           return true;
	       }
	    }
	    return false;
};


/*
 * doubleOberser Functions
 */

var addObservable = function(observable){
	messageSend.addRegToken(msgRegToken);
};

var deleteObservable = function(observable){
	messageSend.deleteRegToken(msgRegToken);
};

var getObservableData = function( pThingID,  pType){
	/*
	 * Not needed yet
	 * Devices only saved by Token
	 */
};

var getObservables = function(){
	return messageSend.getRegTokens();
};

var handleObservableMessage =function(message){
	switch (message) {
        case "TurnOn":
        	LED.turnOn(led1);
        break;

        case "TurnOff":
        	LED.turnOff(led1);
        break;

        case "RGB OFF":
        	RGBLED.control("OFF",rgb1);
        break;

        case "RGB RED":
          	RGBLED.control("RED",rgb1);
        break;
              
        case "RGB BLUE":
          	RGBLED.control("BLUE",rgb1);
        break;

        case "RGB GREEN":
          	RGBLED.control("GREEN",rgb1);
        break;

        case "pottyData":
          	database.getDataFromDB("poti1");
        break;

        case "tempData":
          	database.getDataFromDB("temp1");
        break;

        case "DELETE":
       		console.log("Delete: " + msgRegToken);
         	deleteObservable(msgRegToken);
        break;
        
        default:
        	console.log("Unknown Message")
        break;
    }
};
