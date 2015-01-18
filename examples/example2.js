#!/usr/bin/env node

var TelldusEvents = require('..').TelldusEvents;



var te = new TelldusEvents();

te.on('connect', function () {
  console.log('listening for events');
});

te.on('raw:sensor', function (payload) {
  console.log('raw', payload);
});

te.on('raw:command', function (payload) {
  console.log('raw', payload);
});
