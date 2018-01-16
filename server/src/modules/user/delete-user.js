const db = require('../../connections/db');

module.exports = function(userId) {
  let _userId = db.escape(userId);
  return db.query(`UPDATE users SET status='deleted' WHERE id=${_userId}`);
}
