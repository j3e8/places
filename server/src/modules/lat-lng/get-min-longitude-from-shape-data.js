const getValue = require('./get-value');
// const crossesInternationalDateline = require('./crosses-international-dateline');
// const convertToWesternCoordinates = require('./convert-to-western-coordinates');

module.exports = function(shapeData) {
  // if (crossesInternationalDateline(shapeData)) {
  //   shapeData = convertToWesternCoordinates(shapeData);
  // }
  return getValue('min', 'lng', shapeData);
}
