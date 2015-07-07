#!/usr/bin/env node
var tellsock = require('..');
var TelldusClient = tellsock.TelldusClient;


var tc = new TelldusClient();


tc.tdGetNumberOfDevices()
.then(function (count) {
  console.log('%d number of devices is configured', count);
  return tc.tdGetName(1);
})
.then(function (name) {
  console.log('device 1 is called "%s"', name);
  return tc.tdMethods(1, tellsock.DeviceMethods.TURNON | tellsock.DeviceMethods.TURNOFF);
})
.then(function (methods) {
  console.log('supports turnon', (methods & tellsock.DeviceMethods.TURNON) > 0);
  console.log('supports turnoff', (methods & tellsock.DeviceMethods.TURNOFF) > 0);
  console.log('supports dim', (methods & tellsock.DeviceMethods.DIM) > 0);
  return tc.tdTurnOn(1);
})
.then(function (result) {
  console.log('device 1 was turned on:', result === 0);
  return tc.tdTurnOff(1);
})
.then(function (result) {
  console.log('device 1 was turned off:', result === 0);
})
.catch(function (err) {
  console.error('and error occured', err);
});
