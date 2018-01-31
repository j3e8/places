const PlaceModule = require('../../modules/place');

module.exports = function(user, userId, placeId, requestBody) {
  if (requestBody.isChecked) {
    return PlaceModule.updateUserPlace(userId, placeId, requestBody);
  }
  else {
    return PlaceModule.deleteUserPlace(userId, placeId)
    .then(() => '');
  }
}
