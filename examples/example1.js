

var TelldusEvents = require('..').TelldusEvents;



var te = new TelldusEvents();

te.on('connected', function () {
  console.log('listening for events');
});

te.on('sensor', function (msg) {
  console.log('sensor', msg);
});

te.on('raw', function (msg) {
  console.log('raw', msg);
})