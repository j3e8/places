const PlaceModule = require('../../modules/place');

module.exports = function(user, placeId, requestBody) {
  return PlaceModule.updatePlace(user, placeId, requestBody);
}
