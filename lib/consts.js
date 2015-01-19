

exports.DeviceMethods = {
  TURNON: 1,
  TURNOFF: 2,
  BELL: 4,
  TOGGLE: 8,
  DIM: 16,
  LEARN: 32,
  EXECUTE: 64,
  UP: 128,
  DOWN: 256,
  STOP: 512,
};

exports.TELLSTICK = {
  //sensor data types
  TEMPERATURE: 1,
  HUMIDITY: 2,
  RAINTOTAL: 4,
  RAINRATE: 8,
  WINDDIRECTION: 16,
  WINDAVERAGE: 32,
  WINDGUST: 64
};

exports.DATANAME = {
  1: 'temperature',
  2: 'humidity',
  4: 'raintotal',
  8: 'rainrate',
  16: 'winddirection',
  32: 'windaverage',
  64: 'windgust'
};

exports.METHODNAME = {
  1: 'turnon',
  2: 'turnoff',
  4: 'bell',
  8: 'toggle',
  16: 'dim',
  32: 'learn',
  64: 'execute',
  128: 'up',
  256: 'down',
  512: 'stop'
};
