const db = require('../../connections/db');

module.exports = function() {
  return db.query(`SELECT id, iconUrl, sortOrder FROM icons ORDER BY sortOrder`);
}
