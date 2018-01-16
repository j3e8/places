const PlaceModule = require('../../modules/place');

module.exports = function(requestBody) {
  return PlaceModule.insertPlace({ 'id': 1, 'name': 'j3e8' }, requestBody);
}
