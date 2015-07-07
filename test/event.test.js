//var Code = require('code');   // assertion library
//var expect = Code.expect;
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var fs = require('fs');
var TelldusEvents = require('..').TelldusEvents;

var SOCKETFILE = '/tmp/TelldusEvents';

var EventSocket = require('./mock.eventsocket');
var es;

lab.experiment('TelldusEvents', function () {
  lab.before(function (done) {
    if (!fs.existsSync(SOCKETFILE)) {
      es = new EventSocket();
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


  lab.test('add', function (done) {
    var te = new TelldusEvents();
    te.on('connect', done);
  });
});
