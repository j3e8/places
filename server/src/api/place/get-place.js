const PlaceModule = require('../../modules/place');

module.exports = function(placeId) {
  return PlaceModule.getPlace(placeId);
}
