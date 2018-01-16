const db = require('../../connections/db.js');

module.exports = function() {
  return db.query(`SELECT * FROM placeTypes ORDER BY placeType`);
}
