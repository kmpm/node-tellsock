var Code = require('code');   // assertion library
var expect = Code.expect;
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var fs = require('fs');
var TelldusEvents = require('..').TelldusEvents;

var SOCKETFILE = process.env.SOCKETFILE || '/tmp/MockTelldusEvents';

var EventSocket = require('./mock.eventsocket');
var es;

lab.experiment('TelldusEvents', function () {
  lab.before(function (done) {
    if (!fs.existsSync(SOCKETFILE)) {
      es = new EventSocket(SOCKETFILE);
      return es.listen(done);
    }
    else {
      done();
    }
  });


  lab.after(function (done) {
    if (es) {
      es.close();
      if (fs.existsSync(SOCKETFILE)) {
        return fs.unlink(SOCKETFILE, done);
      }
    }
    done();
  });


  lab.test('raw', function (done) {
    var te = new TelldusEvents({eventSocket: SOCKETFILE});
    te.on('connect', function () {
      //console.log('about to fake');
      es.fakeTemperatureHumidity();
    });
    te.once('raw', function (message) {
      expect(message.class).to.equal('sensor');
      expect(message.controllerId).to.equal(1);
      done();
    });

  });
});
