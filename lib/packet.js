var util = require('util');
var Reader = require('./reader');

function parseSensorEvent(r, packet) {
  var payload = packet.payload;
  var v;
  payload.protocol = v = r.next();
  payload.model = v = r.next();
  if (payload.protocol === 'fineoffset' &&
    payload.model === 'temperaturehumidity') {
    payload.id = r.readIS();
    var num = r.readIS();
    if(num === '1') {
      payload.temperature = v = parseFloat(r.next());
    }
    else if(num === '2') {
      payload.humidity = v = parseFloat(r.next());
    }
    payload.ts = new Date(parseInt(v = r.readIS() + '000'));
  }
  else {
    throw new Error(util.format('Unknown sensor model:%j', payload));
  }
  return v;
}

function parseRawDeviceEvent(r, packet) {
  var v;
  var payloads = r.next().split(';');
  payloads.forEach(function (p) {
    if (!p) {return;}
    var kv = p.split(':');
    packet.payload[kv[0]] = kv[1];
  });

  packet.num = v = parseInt(r.readIS());
  return v;
}

exports.read = function (data) {
  var k, v;
  var r = new Reader(data);
  var packet = {topic: '', payload:{}};
  var count = 0;
  //read to end or an arbritary count of 5
  while(!r.eof() && count++ < 5) {
    packet.topic = v = r.next();
   //console.log('v=', packet.topic);
    if (v === 'TDSensorEvent') {
      v = parseSensorEvent(r, packet);
    }
    else if (v === 'TDRawDeviceEvent') {
      v = parseRawDeviceEvent(r, packet);
    }
    else {
      throw new Error(util.format('Unkown message type:%j', packet));
    }
  }

  return packet;
}