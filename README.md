node-tellsock
=============

A pure socket interface for connecting node.js to a Tellstick Duo.


Installation
------------
```
npm install tellsock
```


Usage
-----
All methods can be used with classic node callbacks
but I prefer using the promise interface implemented
using bluebird.


Event Examples
--------------
```javascript

var TelldusEvents = require('tellsock').TelldusEvents;

var events = new TelldusEvents();


events.on('connect', function () {
  console.log('listening for events');
});

events.on('sensor', function (payload) {
  console.log('sensor', payload);
});

events.on('raw', function (payload) {
  console.log('raw', payload);
});

events.on('message', function (msg) {
  console.log('message', msg);
});
```

Client Examples
---------------

```javascript
var tellsock = require('tellsock');
var TelldusClient = tellsock.TelldusClient;
var client = new TelldusClient();

client.tdGetNumberOfDevices()
.then(function (count) {
  console.log('%d number of devices is configured', count);
  return client.tdGetName(DEVICE_ID);
})
.then(function (name) {
  console.log('device %s is called "%s"', DEVICE_ID, name);
  return client.tdMethods(DEVICE_ID, tellsock.DeviceMethods.TURNON | tellsock.DeviceMethods.TURNOFF);
})
.then(function (methods) {
  console.log('supports turnon', (methods & tellsock.DeviceMethods.TURNON) > 0);
  console.log('supports turnoff', (methods & tellsock.DeviceMethods.TURNOFF) > 0);
  console.log('supports dim', (methods & tellsock.DeviceMethods.DIM) > 0);
  return client.tdTurnOn(DEVICE_ID);
})
.catch(function (err) {
  console.error('and error occured', err);
});


```


Notes
-----
Lots of inspiration for the client came from
https://github.com/stromnet/jtelldus/blob/master/src/java/se/stromnet/jtelldus/TelldusInterface.java

