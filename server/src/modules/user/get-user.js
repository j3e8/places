const db = require('../../connections/db');

module.exports = function(userId) {
  let _id = db.escape(userId);
  return db.query(`SELECT id, username, email, dateCreated, userType FROM users WHERE id=${_id}`)
  .then((rows) => {
    if (rows.length) {
      return Promise.resolve(rows[0]);
    }
    return null;
  });
}
