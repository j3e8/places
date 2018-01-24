const PlaceModule = require('../../modules/place');

module.exports = function(str) {
  return PlaceModule.searchPlaces(str);
}
