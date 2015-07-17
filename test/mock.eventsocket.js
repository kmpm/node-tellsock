var net = require('net');
var Message = require('../lib/message');

var DEVICES = {
  '1': {name: 'mock device 1'}
};

var CONNECTIONCOUNTER = 0;

var MockConnection = function (sock) {
  this.sock = sock;
  sock.setEncoding('utf-8');
  var number = CONNECTIONCOUNTER++;
  this.open = true;
  //console.log('%d: new connection created', number);
  function writeMessage(message, callback) {
    var data = message.toString();
    //console.log('%d: writing', number, data);
    return sock.write(new Buffer(data), 'utf-8', callback);
  }

  this.writeMessage = writeMessage;

  sock.on('data', function (data) {
    var msg = Message.load(data);
    var str = msg.readString();
    if (str === 'tdGetNumberOfDevices') {
      writeMessage(new Message().addInteger(1));
    }
    else if (str === 'tdGetName') {
      var deviceId = msg.readInteger().toString();
      writeMessage(new Message().addString(DEVICES[deviceId].name));
    }
    else {
      console.log('%d: data', number, arguments);
    }
  });

  sock.on('end', function () {
    this.open = false;
  });
};


var EventSocket = module.exports = function (socketfile) {
  this.socketfile = socketfile || '/tmp/TelldusEvents';
  //console.log('mock Socket');
  this.cnns = [];
};

EventSocket.prototype.close = function () {
  this.conn.close();
};

EventSocket.prototype.listen = function (callback) {
  var conn = new net.Server();
  var self = this;
  conn.listen(this.socketfile);
  self.conn = conn;


  //Eventlistener on connection
  conn.on('listening', function () {
    //console.log('mock listening');
    callback();
  });

  conn.on('connection', function (sock) {
    var c = new MockConnection(sock);
    self.cnns.push(c);
  });

  conn.on('close', function () {
    //console.log('mock closed');
  });

  conn.on('error', function (err) {
    console.log('mock error', err);
    throw err;
  });
};


EventSocket.prototype.fakeTemperatureHumidity = function () {
  var rawdata = 'class:sensor;protocol:fineoffset;model:temperaturehumidity;temp:21.4;humidity:0x20;id:0x87;';
  var raw = new Message().addString('TDRawDeviceEvent').addString(rawdata)
  .addInteger(1);
  //temperature
  var sensor = new Message().addString('TDSensorEvent').addString('fineoffset')
    .addString('temperaturehumidity').addInteger(135).addInteger(1).addString('21.4')
    .addInteger(1421609779);
  //humidity
  sensor.addString('TDSensorEvent').addString('fineoffset').addString('temperaturehumidity')
    .addInteger(135).addInteger(2).addString('32').addInteger(1421609779);

  this.cnns.forEach(function (c) {
    c.writeMessage(raw);
    setTimeout(c.writeMessage.bind(c, sensor), 100);
  });
};


