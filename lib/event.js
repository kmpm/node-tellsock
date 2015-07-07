var net = require('net');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Message = require('./message');


var TelldusEvents = module.exports = function (options) {
  var self = this;
  options = options || {};
  options.eventSocket = options.eventSocket || '/tmp/TelldusEvents';

  // Set up a connection to the TelldusEvents socket
  var conn = net.createConnection(options.eventSocket);

  // Set the encoding so that you get data that is actually readable by humans
  conn.setEncoding('utf-8');

  //Eventlistener on connection
  conn.on('connect', function () {
    self.emit('connect');
  });

  conn.on('close', function () {
    self.emit('close');
  });

  conn.on('error', function (err) {
    self.emit('error', err);
  });


  //Eventlistener on data recieved
  conn.on('data', function(data) {
    try {
      var o = Message.load(data).toObject();
    }
    catch (err) {
      self.emit('error', err);
    }

    if (o.topic === 'TDRawDeviceEvent') {
      self.emit('raw', o.payload);
      self.emit('raw:' + o.payload.class, o.payload);
    } else if (o.topic === 'TDSensorEvent') {
      self.emit('sensor', o.payload);
    } else if (o.topic === 'TDDeviceEvent') {
      self.emit('device', o.payload);
    } else {
      if (process.env.NODE_ENV === 'test') {
        throw new Error(util.format('Unkown topic:%j', o));
      }
    }
    self.emit('message', o);
    self.emit(o.topic, o.payload);
  });
};

util.inherits(TelldusEvents, EventEmitter);
