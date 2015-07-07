var net = require('net');

var EventSocket = module.exports = function () {
  this.socketfile = '/tmp/TelldusEvents';
  console.log('mock Socket');
}

EventSocket.prototype.listen = function (callback) {

  var conn = new net.Server();
  var socketfile = this.socketfile;

  conn.listen(this.socketfile);

  //Eventlistener on connection
  conn.on('listening' , function () {
    console.log('mock connected');
    callback();
  });

  conn.on('close', function () {
    console.log('mock closed');
  });

  conn.on('error', function (err) {
    console.log('mock error', err);
    throw err;
  });
}


