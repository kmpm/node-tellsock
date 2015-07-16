#!/usr/bin/env node
var tellsock = require('..');
var TelldusClient = tellsock.TelldusClient;

var DEVICE_ID = 1;
var tc = new TelldusClient();

tc.tdGetNumberOfDevices()
.then(function (count) {
  console.log('%d number of devices is configured', count);
  return tc.tdGetName(DEVICE_ID);
})
.then(function (name) {
  console.log('device %s is called "%s"', DEVICE_ID, name);
  return tc.tdMethods(DEVICE_ID, tellsock.DeviceMethods.TURNON | tellsock.DeviceMethods.TURNOFF);
})
.then(function (methods) {
  console.log('supports turnon', (methods & tellsock.DeviceMethods.TURNON) > 0);
  console.log('supports turnoff', (methods & tellsock.DeviceMethods.TURNOFF) > 0);
  console.log('supports dim', (methods & tellsock.DeviceMethods.DIM) > 0);
  return tc.tdTurnOn(DEVICE_ID).delay(2000);
})
.then(function (result) {
  console.log('device %s was turned on:', DEVICE_ID, result === 0);
  return tc.tdTurnOff(DEVICE_ID);
})
.then(function (result) {
  console.log('device %s was turned off:', DEVICE_ID, result === 0);
})
.catch(function (err) {
  console.error('and error occured', err);
});

