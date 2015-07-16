var net = require('net');
var Promise = require('bluebird');
var Message = require('./message');


var TelldusClient = module.exports = function (options) {
  options = options || {};
  options.eventSocket = options.eventSocket || '/tmp/TelldusClient';

  function sendToService(buf, callback) {
    return new Promise(function (resolve, reject) {
      // Set up a connection to the TelldusClient socket
      var socket = net.createConnection(options.eventSocket);
      // Set the encoding so that you get data that is actually readable by humans
      socket.setEncoding('utf-8');
      //Eventlistener on connection
      socket.on('connect', function () {
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
    }).nodeify(callback);
  }

  this.getIntegerFromService = function (message) {
    var data = message.toString();
    return sendToService(new Buffer(data))
    .then(function (msg) {
      return msg.readInteger();
    });
  };

  this.getStringFromService = function (message, callback) {
    return sendToService(new Buffer(message.toString()))
    .then(function (msg) {
      return msg.readString();
    }).nodeify(callback);
  };
};


TelldusClient.prototype.tdGetNumberOfDevices = function (callback) {
  return this.getIntegerFromService(
    new Message('tdGetNumberOfDevices')).nodeify(callback);
};

TelldusClient.prototype.tdMethods = function (deviceId, methods, callback) {
  methods = methods || 0;
  return this.getIntegerFromService(
    new Message('tdMethods').addInteger(deviceId).addInteger(methods)
  ).nodeify(callback);
};

TelldusClient.prototype.tdGetName = function (deviceId, callback) {
  return this.getStringFromService(
    new Message('tdGetName').addInteger(deviceId)).nodeify(callback);
};

TelldusClient.prototype.tdTurnOn = function (deviceId, callback) {
  return this.getIntegerFromService(
    new Message('tdTurnOn').addInteger(deviceId)).nodeify(callback);
};

TelldusClient.prototype.tdTurnOff = function (deviceId, callback) {
  return this.getIntegerFromService(
    new Message('tdTurnOff').addInteger(deviceId)).nodeify(callback);
};

TelldusClient.prototype.tdDim = function (deviceId, level, callback) {
  return this.getIntegerFromService(
    new Message('tdDim').addInteger(deviceId).addInteger(level)
  ).nodeify(callback);
};

TelldusClient.prototype.tdLearn = function (deviceId, callback) {
  return this.getIntegerFromService(
    new Message('tdLearn').addInteger(deviceId)).nodeify(callback);
};

TelldusClient.prototype.tdLastSentValue = function (deviceId, callback) {
  return this.getStringFromService(
    new Message('tdLastSentValue').addInteger(deviceId)
  ).nodeify(callback);
};

TelldusClient.prototype.tdLastSentCommand = function (deviceId, methods, callback) {
  return this.getIntegerFromService(
      new Message('tdLastSentCommand').addInteger(deviceId).addInteger(methods)
  ).nodeify(callback);
};

