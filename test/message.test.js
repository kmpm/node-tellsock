var Code = require('code');   // assertion library
var expect = Code.expect;
var Lab = require('lab');
var lab = exports.lab = Lab.script();


var Message = require('../lib/message');
var messages = require('./packets.json');

lab.experiment('Message', function () {

  lab.test('create', function (done) {
    var msg = new Message('tdGetName');
    var str = msg.addInteger(1).toString();

    expect(str).to.equal('9:tdGetNamei1s');
    expect(msg.index).to.equal(14);
    done();
  });


  lab.test('parse', function (done) {
    var msg = Message.load('9:tdGetnamei1s');
    var method = msg.readString();
    var arg = msg.readInteger();
    expect(method).to.equal('tdGetname');
    expect(arg).to.equal(1);
    done();
  });


  lab.test('read TDRawDeviceEvent', function (done) {
    var msg = Message.load(messages[0].data);
    var p = msg.toObject();
    expect(p).to.exist();
    expect(p).to.deep.include({
      topic: 'TDRawDeviceEvent',
      payload:{
        class: 'sensor',
        protocol: 'fineoffset',
        model: 'temperaturehumidity',
        temp: '21.1',
        humidity: '0x1F',
        id: '0x87',
        controllerId: 1
      },
    });
    done();
  });


  lab.test('read TDSensorEvent', function (done) {
    var msg = Message.load(messages[1].data);
    var p = msg.toObject();
    expect(p).to.exist();
    expect(p).to.deep.include({
      topic: 'TDSensorEvent',
      payload: {
        protocol: 'fineoffset',
        model: 'temperaturehumidity',
        id: 135,
        temperature: '21.1',
        ts: new Date(1421492433000),
        humidity: '31'
      }
    });
    done();
  });


  lab.test('read TDDeviceEvent', function (done) {
    var msg = Message.load(messages[21].data);
    var p = msg.toObject();

    expect(p).to.exist();
    expect(p, 'turnon device 1').to.deep.include({
      topic: 'TDDeviceEvent',
      payload: {device: 1, methodCode: 1, method: 'turnon', data: '0'}
    });

    p = Message.load(messages[23].data).toObject();
    expect(p, 'turnoff device 5').to.deep.include({
      topic: 'TDDeviceEvent',
      payload: {device: 5, methodCode: 2, method: 'turnoff', data: '0'}
    });
    done();
  });


  lab.test('parse all packets', function (done) {
    messages.forEach(function (m) {
      var p = Message.load(m.data).toObject();
      expect(p).to.include(['topic', 'payload']);
    });
    done();
  });
});
