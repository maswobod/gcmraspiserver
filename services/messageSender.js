// Send Message Module
var gcm = require('node-gcm');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var msSender;
// Tokens to send 
var regTokens = [];

/*
 * PUBLIC METHODS.
 */

function messageSender()
{
	EventEmitter.call(this);
}
util.inherits(messageSender, EventEmitter);


messageSender.prototype.init = function( sender ){
	msSender = new gcm.Sender(sender);

	SNDMSG();
};

messageSender.prototype.addRegToken = function(regToken){
    regTokens.push(regToken);
};

messageSender.prototype.deleteRegToken = function(regToken){
    var a = regTokens.indexOf(regToken);
    regTokens.splice(a, 1);
};

messageSender.prototype.getRegTokens = function(){
    return regTokens;
};

//Function to message the Device
messageSender.prototype.messageDevice = function(notiTitle, notiBody, data){
      //The Message itself
  var message = new gcm.Message(); 
  
  if(data){
    console.log("Data send: " +data);
    message.addData("Measurement" ,data);
    message.addData("Name", "Poti1");
  };
  
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

/*
 * PRIVATE METHODS.
 */ 

function SNDMSG(){
	console.log("Message Sender defined");
};

module.exports = new messageSender;
