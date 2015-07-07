var util = require('util');
var consts = require('./consts');

var Message = module.exports = function (data) {
  if (!(this instanceof Message)) {
    return new Message(data);
  }
  data = data || '';
  if (data.length > 0) {
    this.data = util.format('%d:%s', data.length, data);
  }
  else {
    this.data = data;
  }
  this.index = this.data.length;
};

Message.prototype.readString = function () {
  var pos = this.data.indexOf(':', this.index);
  var size = parseInt(this.data.substring(this.index, pos));
  this.index = pos + size + 1;

  return this.data.substring(pos + 1, this.index);
};

Message.prototype.readInteger = function () {
  if (this.data[this.index] !== 'i') {
    throw new Error('No integer to read');
  }
  this.index++;
  var pos = this.data.indexOf('s', this.index);
  var v = parseInt(this.data.substring(this.index, pos));
  this.index = pos + 1;
  return v;
};


Message.prototype.addString = function (text) {
  var v;
  this.data += v = util.format('%d:%s', text.length, text);
  this.index += v.length;
  return this;
};


Message.prototype.addInteger = function (value) {
  if (typeof value !== 'number') {
    throw new TypeError('value must be number');
  }
  var v;
  this.data += v = util.format('i%ds', value);
  this.index += v.length;
  return this;
};

Message.prototype.eof = function () {
  return this.index >= this.data.length;
};

Message.prototype.toObject = function () {
  var o = {topic: '', payload: {}};
  this.index = 0;
  var count = 0;
  while (!this.eof() && count++ < 5) {
    o.topic = this.readString();
    if (o.topic === 'TDSensorEvent') {
      parseSensorEvent(this, o);
    } else if (o.topic === 'TDRawDeviceEvent') {
      parseRawDeviceEvent(this, o);
    } else if (o.topic === 'TDDeviceEvent') {
      parseDeviceEvent(this, o);
    } else {
      if (process.env.NODE_ENV === 'test') {
        throw new Error(util.format('Unkown message type:%j', o));
      }
    }
  }
  return o;
};


Message.prototype.toString = function () {
  return this.data;
};

Message.load = function (data) {
  var msg = new Message();
  msg.data = data;
  msg.index = 0;
  return msg;
};


function parseSensorEvent(r, o) {
  var payload = o.payload;
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


function parseDeviceEvent(r, o) {
  var v;
  o.payload.device = r.readInteger();
  o.payload.methodCode = parseInt(r.readInteger());
  o.payload.method = consts.METHODNAME[o.payload.methodCode];
  o.payload.data = v = r.readString();
  return v;
}


function parseRawDeviceEvent(r, o) {
  var v;
  var payloads = r.readString().split(';');
  payloads.forEach(function (p) {
    if (!p) { return; }
    var kv = p.split(':');
    o.payload[kv[0]] = kv[1];
  });

  o.payload.controllerId = v = parseInt(r.readInteger());
  return v;
}
