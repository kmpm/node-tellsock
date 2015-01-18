var fs = require('fs');
var readline = require('readline');


var DumpReader = module.exports = function (filename) {
  if (!(this instanceof DumpReader)) {
    return new DumpReader(filename);
  }
  this.data = fs.readFileSync(filename, {encoding: 'utf-8', flag: 'r'});
  this.data = this.data.split('\n');
  this.index = 0;
  //console.log('data length', this.data.length);
}


DumpReader.prototype.moveFirst = function () {
  this.index = 0;
  return this;
}

DumpReader.prototype.next = function(index) {
  index = index || this.index;
  if (this.index >= this.data.length - 1) {
    return null;
  }
  this.index = index;
  return JSON.parse(this.data[this.index++]);
};
