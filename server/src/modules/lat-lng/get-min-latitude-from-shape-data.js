const getValue = require('./get-value');

module.exports = function(shapeData) {
  return getValue('min', 'lat', shapeData);
}
