/*
* Prototype Server for GCM Bidirectional Connection
* Author: Martin Swoboda
* Version: 030516
* TODO: Sensoren als Service
*/
//All Modules which must be displayd in app must be in this array
var modules = {
	modules: []
	};

//LED Service Object
var LED = require('./services/led');
//Init LED Port 7
LED.init(7);
modules.modules.push({'LED' : 'Licht1'});

//RGB LED Service
var RGBLED = require('./services/rgbled');
RGBLED.init(15,13,11);
modules.modules.push({'RGBLED' : 'Licht20'});

//Buttons Service Object
/*
var btn1 = require('./services/button');
btn1.init(29);
var btn2  = require('./services/button');
btn2.init(31);
*/
//Poti Service Object
var poti = require('./services/poti');
/*
 *Init like this:
 *var poti_channel = 7;  // Analog/Digital-Channel
 *var CLK_Pin = 23; // Clock bcm 11
 *var DIN_Pin = 19; // Digital in bcm 10
 *var DOUT_Pin = 21;  // Digital out bcm 9
 *var CS_Pin = 24; //Chip-Select bcm 8
 */
var interval = 30000; // Every 30 sec
poti.init(23,19,21,24,7);
setInterval(function() {
	console.log("Check for Poti Data");
	poti.getPotiData(); 
}, interval);
modules.modules.push({'POTI' : 'Poti1'});

//Temp Service Object
/*
var temp = require('./services/temp');
temp.init(23,19,21,24,5);
setInterval(function() {
	console.log("Check for Temp Data");
	temp.getTempData();
}, 3000);*/
//modules.modules.push({"TEMP" : "Temperatur"});


//Database Service Object
var database = require('./services/database');
database.init();

// Keep track of the chat clients
var clients = [];

//To send Messages
var messageSend = require('./services/messageSender');
messageSend.init('AIzaSyBAirrWt0-MbnVqR5l8YTIsc0foFYmHJPc');

//To recive Messages
var xmpp = require('node-xmpp-client');
 
//Set node-xmpp options.
//Replace with your projectID in the jid and your API key in the password
//The key settings for CCS are the last two to force SSL and Plain SASL auth.
var options = {
  type: 'client',
  jid: '508133522449@gcm.googleapis.com',
  password: 'AIzaSyBAirrWt0-MbnVqR5l8YTIsc0foFYmHJPc',
  port: 5235,
  host: 'gcm.googleapis.com',
  legacySSL: true,
  preferredSaslMechanism : 'PLAIN'
};

console.log('creating xmpp app');

var cl = new xmpp.Client(options);
cl.on('online',
  function() {
    console.log("online");
  });

cl.on('stanza',
  function(stanza) {
    if (stanza.is('message') &&
        // Best to ignore an error
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

        //Now do something useful here with the message
        //e.g. awesomefunction(messageData);
        //but let's just log it.

        //check if regToken is in Reg tokens
        var msgRegToken = messageData.from;
        /*
		 * if msgRegToken is not in reg tokes than add it to the 
		 * tokens an send messega to device with modules used
         */
        if (!(contains(messageSend.getRegTokens(),msgRegToken))) {
        	console.log("Add Reg Token & send all modules");
        	messageSend.addRegToken(msgRegToken);
        	//TODO: Send all data from modules 
        	messageSend.messageDevice("Thing Name here", "Noti title here", "Hallo form new Thing", modules, "Modules" );
        }else{
        	console.log("Already in RegTokens");
        };

        switch (messageData.data.message) {
          case "TurnOn":
            LED.turnOn();
            break;

          case "TurnOff":
            LED.turnOff();
            break;

          case "RGB OFF":
            RGBLED.control("OFF");
            break;

          case "RGB RED":
            RGBLED.control("RED");
          break;
              
          case "RGB BLUE":
            RGBLED.control("BLUE");
          break;

          case "RGB GREEN":
            RGBLED.control("GREEN");
          break;

          case "pottyData":
            var data = database.getDataFromDB("poti1");
            messageSend.messageDevice("Thing 1", null, null, data, "POTIALL");
            break;

         case "DELETE":
         	console.log("Delete: " + msgRegToken);
         	messageSend.deleteRegToken(msgRegToken);

         default:
            console.log("Unknown Message")
            break;
        }
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

var contains = function(a, obj){
	var i = a.length;
	    while (i--) {
	       if (a[i] === obj) {
	           return true;
	       }
	    }
	    return false;
};
