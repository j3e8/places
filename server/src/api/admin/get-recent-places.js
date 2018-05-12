const PlaceModule = require('../../modules/place');

module.exports = function(user) {
  if (user.userType != 'admin') {
    return Promise.reject({ code: 401, message: "Unauthorized, you fool" });
  }

  return PlaceModule.getRecentPlaces(50);
}
