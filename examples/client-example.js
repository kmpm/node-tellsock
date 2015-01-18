#!/usr/bin/env node

var TelldusClient = require('..').TelldusClient;



var tc = new TelldusClient();

tc.tdGetNumberOfDevices(function (err, count) {
  if (err) {
    return console.error('Unexpected error', err);
  }
  else {
    console.log('count:', count);
  }
})


tc.tdGetName(1, function (err, name) {
  if (err) {throw err;}
  console.log('name 1:', name);
});