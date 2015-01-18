var net = require('net');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Packet = require('./packet');


var TelldusEvents = module.exports = function (options) {
  var self = this;
  options = options || {};
  options.eventSocket = options.eventSocket || '/tmp/TelldusEvents';

  // Set up a connection to the TelldusEvents socket
  var conn = net.createConnection(options.eventSocket);

  // Set the encoding so that you get data that is actually readable by humans
  conn.setEncoding('utf-8');

  //Eventlistener on connection
  conn.on('connect' , function () {
    self.emit('connected');
  });


  //Eventlistener on data recieved
  conn.on('data', function(data) {
    try {
      var p = Packet.read(data);
    }
    catch (err) {
      self.emit('error', err);
    }
    if(p.topic === 'TDRawDeviceEvent') {
      self.emit('raw', p.payload);
      self.emit('raw:' + p.payload.class, p.payload);
    }
    else if(p.topic === 'TDSensorEvent') {
      self.emit('sensor', p.payload);
    }
    else {
      throw new Error(util.format('Unkown topic:%j', p));
    }
  });
}

util.inherits(TelldusEvents, EventEmitter);