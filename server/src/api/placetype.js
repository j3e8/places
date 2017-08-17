let db = require('../connections/db.js');
let PlaceType = {};

PlaceType.listAll = function() {
  return db.query(`SELECT * FROM placeTypes ORDER BY placeType`);
}

module.exports = PlaceType;
