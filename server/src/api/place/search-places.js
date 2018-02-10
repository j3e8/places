const PlaceModule = require('../../modules/place');
const RADIUS = 10000; // meters

module.exports = function(query) {
  if (query.search) {
    return PlaceModule.searchPlaces(query.search);
  }
  else if (query.lat && query.lng) {
    return PlaceModule.searchPlacesByLocation(query.lat, query.lng, RADIUS);
  }
  else {
    return PlaceModule.getPopularPlaces();
  }
}
