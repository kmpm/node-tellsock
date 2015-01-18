#!/usr/bin/env node

var TelldusEvents = require('..').TelldusEvents;



var te = new TelldusEvents();

te.on('connect', function () {
  console.log('listening for events');
});

te.on('message', function (msg) {
  console.log('message', msg);
});
