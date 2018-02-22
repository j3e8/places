const PlaceModule = require('../../modules/place');

module.exports = function(userId) {
  return PlaceModule.getRecentPlacesForUser(userId);
}
