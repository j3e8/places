const PlaceModule = require('../../modules/place');

module.exports = function(user, requestBody) {
  if (user) {
    return PlaceModule.insertPlace(user, requestBody);
  }
  return Promise.reject({ code: 401, message: "Unauthorized" });
}
