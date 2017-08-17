let PlaceHelper = require('../modules/place-helper');
let Place = {};

Place.create = function(requestBody) {
  return PlaceHelper.insert({ 'id': 1, 'name': 'j3e8' }, requestBody);
}

Place.update = function(placeId, requestBody) {
  return PlaceHelper.update(placeId, requestBody);
}

Place.get = function(placeId) {
  return PlaceHelper.select(placeId);
}

module.exports = Place;
