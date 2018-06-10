const PlaceModule = require('../../modules/place');

module.exports = function(user, userId, placeId, requestBody) {
  return PlaceModule.updateUserPlace(userId, placeId, requestBody);
}
