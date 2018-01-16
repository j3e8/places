const PlaceModule = require('../../modules/place');

module.exports = function(placeId, requestBody) {
  return PlaceModule.updatePlace(placeId, requestBody);
}
