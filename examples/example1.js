#!/usr/bin/env node

var TelldusEvents = require('..').TelldusEvents;


var te = new TelldusEvents();

te.on('connect', function () {
  console.log('listening for events');
});

te.on('sensor', function (payload) {
  console.log('sensor', payload);
});

te.on('raw', function (payload) {
  console.log('raw', payload);
});

te.on('message', function (msg) {
  console.log('message', msg);
});