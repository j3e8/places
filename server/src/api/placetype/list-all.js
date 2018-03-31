const db = require('../../connections/db.js');

module.exports = function() {
  return db.query(`SELECT * FROM placetypes ORDER BY placeType`);
}
