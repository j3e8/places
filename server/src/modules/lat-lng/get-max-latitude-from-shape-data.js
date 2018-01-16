const getValue = require('./get-value');

module.exports = function(shapeData) {
  return getValue('max', 'lat', shapeData);
}
