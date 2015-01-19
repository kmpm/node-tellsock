var net = require('net');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Message = require('./message');



var TelldusClient = module.exports = function (options) {
  var self = this;
  options = options || {};
  options.eventSocket = options.eventSocket || '/tmp/TelldusClient';

  sendToService = function (buf, callback) {
    // Set up a connection to the TelldusClient socket
    var socket = net.createConnection(options.eventSocket);

    // Set the encoding so that you get data that is actually readable by humans
    socket.setEncoding('utf-8');

    //Eventlistener on connection
    socket.on('connect' , function () {
      socket.write(buf);
    });

    socket.on('close', function () {
      //console.log('close')
    });

    socket.on('error', function (err) {
      //console.log('error', err);
      callback(err);
    });

    socket.on('data', function (data) {
      var msg = Message.load(data);
      socket.end();
      socket.unref();
      callback(null, msg);
    });

  }

  this.getIntegerFromService = function (message, callback) {
    var data = message.toString();
    sendToService(new Buffer(data), function (err, msg) {
      if (err) {
        return callback(err);
      }
      else {
        callback(null, msg.readInteger());
      }
    });
  }

  this.getStringFromService = function (message, callback) {
    sendToService(new Buffer(message.toString()), function (err, msg) {
      if (err) {
        return callback(err);
      }
      callback(null, msg.readString());
    });
  }
}


TelldusClient.prototype.tdGetNumberOfDevices = function (callback) {
  this.getIntegerFromService(Message('tdGetNumberOfDevices'), callback);
}

TelldusClient.prototype.tdGetName = function (deviceId, callback) {
  this.getStringFromService(Message('tdGetName').addInteger(deviceId), callback);
}

TelldusClient.prototype.tdTurnOn = function (deviceId, callback) {
  this.getIntegerFromService(Message('tdTurnOn').addInteger(deviceId), callback);
}

TelldusClient.prototype.tdTurnOff = function (deviceId, callback) {
  this.getIntegerFromService(Message('tdTurnOff').addInteger(deviceId), callback);
}
