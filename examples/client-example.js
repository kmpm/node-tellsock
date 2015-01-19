#!/usr/bin/env node

var TelldusClient = require('..').TelldusClient;



var tc = new TelldusClient();


tc.tdGetNumberOfDevices()
.then(function (count) {
  console.log('%d number of devices is configured');
  return tc.tdGetName(1);
})
.then(function (name) {
  console.log('device 1 is called "%s"', name);
  return tc.tdTurnOn(1);
})
.then(function (result) {
  console.log('device 1 was turned on:', result === 0);
  return tc.tdTurnOff(1);
})
.then(function (result) {
  console.log('device 1 was turned off:', result === 0);
  return tc.tdTurnOff(1);
})
.catch(function (err) {
  console.error('and error occured', err);
});
