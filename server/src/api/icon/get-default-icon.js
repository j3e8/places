const db = require('../../connections/db');

module.exports = function() {
  return db.query(`SELECT id, iconUrl, sortOrder FROM icons
    WHERE id = (
      SELECT id FROM icons WHERE sortOrder = (
        SELECT MAX(sortOrder) FROM icons
      )
    )`)
  .then((rows) => {
    return rows.length ? Promise.resolve(rows[0]) : null;
  });
}
