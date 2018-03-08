const PlaceModule = require('../../modules/place');
const RADIUS = 10000; // meters

module.exports = function(user, query) {
  if (query.search) {
    return PlaceModule.searchPlaces(user ? user.id : null, query.search);
  }
  else if (query.minLat && query.maxLat && query.minLng && query.maxLng) {
    return PlaceModule.searchPlacesByLocation(query.minLat, query.maxLat, query.minLng, query.maxLng);
  }
  else {
    return PlaceModule.getPopularPlaces();
  }
}
