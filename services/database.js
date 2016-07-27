//Database Module
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/test_1';

//To send Messages
var messageSend = require('./messageSender');

function database()
{
	EventEmitter.call(this);
}
util.inherits(database, EventEmitter);

/*
 * PUBLIC METHODS.
 */

database.prototype.init = function(){
	messageSend.init('AIzaSyBAirrWt0-MbnVqR5l8YTIsc0foFYmHJPc');
	DB();
};

//Function to insert new Poti Data
database.prototype.addDataToDB = function(collectionName, measTime, newValue){
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }else{
      console.log('Connection established to', url);

      var collection = db.collection(String(collectionName));

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

database.prototype.getDataFromDB = function(collectionName){
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
        	if(collectionName == "poti1"){	
	          	var send = {
	          		potiall: []
	          	};
	          	send.potiall.push(result);
        	}else{
        		var send = {
	          		tempall: []
	          	};
	          	send.tempall.push(result);
        	}

          	var datataype = collectionName + "ALL";
          	messageSend.messageDevice("Thing 1", null, null, send, datataype);
        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
        //Close connection
        db.close();
      });
    }
  })
};

/*
 * PRIVATE METHODS.
 */ 

function DB(){
	console.log("Database defined");
};

module.exports = new database;

