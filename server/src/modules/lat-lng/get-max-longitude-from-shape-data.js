const getValue = require('./get-value');

module.exports = function(shapeData) {
  return getValue('max', 'lng', shapeData);
}
