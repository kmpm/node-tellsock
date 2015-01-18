var Code = require('code');   // assertion library
var expect = Code.expect;
var Lab = require('lab');
var lab = exports.lab = Lab.script();


var Packet = require('../lib/packet');
var DumpReader = require('./dumpreader');



lab.experiment('Packet', function () {
  var dr;
  lab.before(function (done) {
    dr = new DumpReader(__dirname + '/packets.json');
    done();
  });


  lab.test('read TDRawDeviceEvent', function (done) {
    var p = Packet.read(dr.next(0).data);
    expect(p).to.exist();
    expect(p).to.deep.include({
      topic: 'TDRawDeviceEvent',
      payload:
       { class: 'sensor',
         protocol: 'fineoffset',
         model: 'temperaturehumidity',
         temp: '21.1',
         humidity: '0x1F',
         id: '0x87' },
      controllerId: 1 });
    done();
  });


  lab.test('read TDSensorEvent', function (done) {
    var p = Packet.read(dr.next(1).data);
    expect(p).to.exist();
    expect(p).to.deep.include({
      topic: 'TDSensorEvent',
      payload:
       { protocol: 'fineoffset',
         model: 'temperaturehumidity',
         id: '135',
         temperature: '21.1',
         ts: new Date(1421492433000),
         humidity: '31' } });
    done();
  });

  lab.test('read TDDeviceEvent', function (done) {
    var p = Packet.read(dr.next(21).data);
    expect(p).to.exist();
    expect(p).to.deep.include({
      topic: 'TDDeviceEvent',
      payload: { methodCode: 1, method: 'turnon', data: '0' }
    });
    done();
  });


  lab.test('parse all packets', function (done) {
    dr.moveFirst();
    var pd, p;
    while( (pd = dr.next()) !== null) {
      p = Packet.read(pd.data);
      expect(p).to.include(['topic', 'payload']);
    }
    done();
  });

});