/*
* Prototype Server for GCM Bidirectional Connection
* Author: Martin Swoboda
* Version: 030516
* TODO: Sensoren als Service
*/

//LED Service Object
var LED = require('./services/led');
//Init LED Port 7
LED.init(7);

//RGB LED Service
var RGBLED = require('./services/rgbled');
RGBLED.init(15,13,11);

//Buttons Service Object
var btn1 = require("./services/btn");
btn1.init(29);

var btn2  = require("./services/btn");
btn2.init(31);


// Setup pins for poti
/*
var poti_channel = 7;  // Analog/Digital-Channel
var CLK_Pin = 23; // Clock bcm 11
var DIN_Pin = 19; // Digital in bcm 10
var DOUT_Pin = 21;  // Digital out bcm 9
var CS_Pin = 24; //Chip-Select bcm 8

gpio.open(CLK_Pin, gpio.OUTPUT, gpio.LOW);
gpio.open(DIN_Pin, gpio.OUTPUT, gpio.LOW);
gpio.open(CS_Pin, gpio.OUTPUT, gpio.LOW);
gpio.open(DOUT_Pin, gpio.INPUT);

// For average Measurement
var anz = 3
*/

// Keep track of the chat clients
var clients = [];

//To send Messages
var gcm = require('node-gcm');

// Set up the sender with you API key
var sender = new gcm.Sender('AIzaSyBAirrWt0-MbnVqR5l8YTIsc0foFYmHJPc');

// Tokens to send 
var regTokens = ['cAo_ls3Z31A:APA91bH_MFXtuU4KZcCDTLy6EIfGW90BGmS5_K1W_fF8G0mb5XQkPdYutVyXnV3AsGxGwWrLlDtcvs1wfRHGvG-EHZPgOtU8-fy1IF2RuNRjl_fyoxJzRkr-ok_tqCG40ImzYL2A9cXB'];

//To recive Messages
var xmpp = require('node-xmpp-client');
 
//To keep Poti Data Persistant (MongoDB)
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/test_1';

//Function to insert new Poti Data
var addDataToDB = function(measTime, newValue){
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }else{
      console.log('Connection established to', url);

      var collection = db.collection("poti1");

      var newPotiData = {Time: measTime, Value: newValue};
      collection.insert(newPotiData, function(err, result){
        if(err){
          console.log(err);
        } else {
          console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
        }
        //Close connection
        db.close();  
      });
    }
  })
};

var getDataFromDB = function(collectionName){
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }else{
      console.log('Connection established to', url);

      var collection = db.collection(collectionName);

      collection.find().toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length) {
          var jString = JSON.stringify(result);
          messageDevice("New Pottydata", "New Pottydata accessable", jString);
        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
        //Close connection
        db.close();
      });
    }
  })
};

//Function to message the Device
var messageDevice = function(notiTitle, notiBody, data){
      //The Message itself
  var message = new gcm.Message(); 
  
  if(data){
    console.log("Data send: " +data);
    message.addData("Measurement" ,data);
    message.addData("Name", "Poti1");
  }
  
  message.addNotification({
    title: notiTitle,
    body: notiBody,
    icon: 'ic_launcher'
  });

  sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    if(err) console.error(err);
    else    console.log(response);
  });
};

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

      console.log(messageData);

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

        //Send Awnser Message
        regTokens = [messageData.from];
        console.log(regTokens);

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
            getDataFromDB("poti1");
            break;

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
