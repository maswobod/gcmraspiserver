/**********************************************************
 * Bachelor Thesis: Design Pattersn for IoT Systems
 * Message Sender Control Module
 * Author: Martin Swoboda
 * Version: 280716
 ***********************************************************/
var gcm = require('node-gcm');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var msSender;
// Tokens to send to
var regTokens = [];

function messageSender()
{
	EventEmitter.call(this);
}
util.inherits(messageSender, EventEmitter);

/*
 * PUBLIC METHODS.
 */
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
messageSender.prototype.messageDevice = function(thingName, notiTitle, notiBody, data, dataType){
      //The Message itself
  var message = new gcm.Message(); 
  
  if(data){
    console.log("Data send: " +data);
    message.addData(dataType ,data);
    message.addData("Name", thingName);
  };
  
  if(notiTitle){ 
    console.log("Send Notification");
      message.addNotification({
        title: notiTitle,
        body: notiBody,
        icon: 'ic_launcher'
      });
  };

  msSender.send(message, { registrationTokens: regTokens }, function (err, response) {
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
