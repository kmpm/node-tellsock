

var TelldusEvents = require('..').TelldusEvents;



var te = new TelldusEvents();

te.on('connected', function () {
  console.log('listening for events');
});

te.on('raw:sensor', function (msg) {
  console.log('raw', msg);
});

te.on('raw:command', function (msg) {
  console.log('raw', msg);
});