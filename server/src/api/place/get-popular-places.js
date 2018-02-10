const PlaceModule = require('../../modules/place');

module.exports = function() {
  return PlaceModule.getPopularPlaces();
}
