var util = require('util');
var Reader = require('./reader');
var consts = require('./consts');


function parseSensorEvent(r, packet) {
  var payload = packet.payload;
  var v;
  payload.protocol = v = r.readString();
  payload.model = v = r.readString();
  payload.id = r.readInteger();
  var dataType = r.readInteger();
  var dataName = consts.DATANAME[dataType];
  payload[dataName] = r.readString();
  payload.ts = new Date(parseInt(v = r.readInteger() + '000'));

  return v;
}


function parseDeviceEvent(r, packet) {
  var v;
  packet.payload.device = r.readInteger();
  packet.payload.methodCode = parseInt(r.readInteger());
  packet.payload.method = consts.METHODNAME[packet.payload.methodCode];
  packet.payload.data = v = r.readString();
  return v;
}


function parseRawDeviceEvent(r, packet) {
  var v;
  var payloads = r.readString().split(';');
  payloads.forEach(function (p) {
    if (!p) {return;}
    var kv = p.split(':');
    packet.payload[kv[0]] = kv[1];
  });

  packet.payload.controllerId = v = parseInt(r.readInteger());
  return v;
}


exports.read = function (data) {
  var k, v;
  var r = new Reader(data);
  var packet = {topic: '', payload:{}};
  var count = 0;
  //read to end or an arbritary count of 5
  while (!r.eof() && count++ < 5) {
    packet.topic = v = r.readString();
   //console.log('v=', packet.topic);
    if (v === 'TDSensorEvent') {
      v = parseSensorEvent(r, packet);
    } else if (v === 'TDRawDeviceEvent') {
      v = parseRawDeviceEvent(r, packet);
    } else if (v === 'TDDeviceEvent') {
      v = parseDeviceEvent(r, packet);
    } else {
      if (process.env.NODE_ENV === 'test') {
        throw new Error(util.format('Unkown message type:%j', packet));
      }
    }
  }

  return packet;
}
