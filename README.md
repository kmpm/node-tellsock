node-tellsock
=============

A pure socket interface for connecting node.js to a Tellstick Duo.


Installation
------------
```
npm install tellsock
```


Examples
--------
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

Notes
-----
Lots of inspiration for the client came from
https://github.com/stromnet/jtelldus/blob/master/src/java/se/stromnet/jtelldus/TelldusInterface.java