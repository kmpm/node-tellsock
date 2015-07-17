var Code = require('code');   // assertion library
var expect = Code.expect;
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var fs = require('fs');
var tellsock = require('..');
var TelldusClient = tellsock.TelldusClient;

var SOCKETFILE = '/tmp/MockTelldusEvents';

var EventSocket = require('./mock.eventsocket');
var es;
var client = new TelldusClient({eventSocket: SOCKETFILE});

lab.experiment('TelldusClient', function () {
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
    if (es && fs.existsSync(SOCKETFILE)) {
      return fs.unlink(SOCKETFILE, done);
    }
    done();
  });


  lab.test('tdGetNumberOfDevices', function (done) {
    client.tdGetNumberOfDevices()
    .then(function (result) {
      expect(result).to.equal(1);
      done();
    })
    .catch(done);
  });

  lab.test('tdGetName', function (done) {
    client.tdGetName(1)
    .then(function (name) {
      expect(name).to.equal('mock device 1');
      done();
    })
    .catch(done);

  });
});
