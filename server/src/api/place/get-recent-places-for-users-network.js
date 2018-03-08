const PlaceModule = require('../../modules/place');

module.exports = function(userId) {
  return PlaceModule.getRecentPlacesForUsersNetwork(userId);
}
