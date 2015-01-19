var net = require('net');
var util = require('util');
var Promise = require('bluebird');
var Message = require('./message');


var TelldusClient = module.exports = function (options) {
  var self = this;
  options = options || {};
  options.eventSocket = options.eventSocket || '/tmp/TelldusClient';

  sendToService = function (buf, callback) {
    return new Promise(function (resolve, reject) {
      // Set up a connection to the TelldusClient socket
      var socket = net.createConnection(options.eventSocket);
      // Set the encoding so that you get data that is actually readable by humans
      socket.setEncoding('utf-8');
      //Eventlistener on connection
      socket.on('connect' , function () {
        socket.write(buf);
      });
      socket.on('error', function (err) {
        //console.log('error', err);
        reject(err);
      });
      socket.on('data', function (data) {
        var msg = Message.load(data);
        socket.end();
        socket.unref();
        resolve(msg);
      });
    });
  }

  this.getIntegerFromService = function (message) {
    var data = message.toString();
    return sendToService(new Buffer(data))
    .then(function (msg) {
      return msg.readInteger();
    });

  }

  this.getStringFromService = function (message, callback) {
    return sendToService(new Buffer(message.toString()))
    .then(function (msg) {
      return msg.readString();
    });
  }
}


TelldusClient.prototype.tdGetNumberOfDevices = function (callback) {
  return this.getIntegerFromService(
    Message('tdGetNumberOfDevices')).nodeify(callback);
}


TelldusClient.prototype.tdMethods = function (deviceId, methods, callback) {
  methods = methods || 0;
  return this.getIntegerFromService(
    Message('tdMethods').addInteger(deviceId).addInteger(methods)
  ).nodeify(callback);
}

TelldusClient.prototype.tdGetName = function (deviceId, callback) {
  return this.getStringFromService(
    Message('tdGetName').addInteger(deviceId)).nodeify(callback);
}

TelldusClient.prototype.tdTurnOn = function (deviceId, callback) {
  return this.getIntegerFromService(
    Message('tdTurnOn').addInteger(deviceId)).nodeify(callback)
}

TelldusClient.prototype.tdTurnOff = function (deviceId, callback) {
  return this.getIntegerFromService(
    Message('tdTurnOff').addInteger(deviceId)).nodeify(callback)
}
