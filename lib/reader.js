
var Reader = module.exports = function (data) {
  this.data = data;
  this.index = 0;
}

Reader.prototype.read = function (length) {
  var s = this.data.substr(this.index, length);
 //console.log('reading "%s" from %d to %d', s, this.index, this.index + length-1);
  this.index += length;
  return s;
}

Reader.prototype.readSize = function (find) {
  var pos = this.data.indexOf(find, this.index);
 //console.log('readSize to %s', pos);
  if (pos >= 0) {
    for (var x = pos - 1; x > 0; x--) {
      var c = this.data.charCodeAt(x);
      //console.log('[%d]=%s, %s', x, c.toString(16), this.data[x]);
      if (c > 0x39) {
        this.index = x + 1;
       //console.log('readSize from %s', this.index);
        x = 0;
      }
    }

    var s = parseInt(this.read(pos - this.index));
    this.index++;
    return s;
  }
  return pos;
}


Reader.prototype.next = function (sep) {
  sep = sep || ':';
  var size = this.readSize(sep);

  if (size >= 0) {
    return this.read(size);
  } else {
    this.index = this.data.length;
    return null;
  }
}

Reader.prototype.readIS = function () {
  var pos = this.data.indexOf('s', this.index);
  //console.log('readIS to %s', pos);
  if (pos >= 0) {
    for (var x = pos - 1; x > 0; x--) {
      if (this.data[x] == 'i') {
        this.index = x + 1;
        //console.log('readIS from %s', this.index);
        x = 0;
      }
    }

    var s = this.read(pos - this.index);
    this.index++;
    return s;
  }
  return pos;
}

Reader.prototype.eof = function () {
  return this.index >= this.data.length;
}

exports.Reader = Reader;
