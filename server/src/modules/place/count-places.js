const db = require('../../connections/db');

module.exports = function() {
  return db.query(`SELECT COUNT(id) as num FROM places WHERE status='active'`)
  .then((rows) => rows[0].num);
}
