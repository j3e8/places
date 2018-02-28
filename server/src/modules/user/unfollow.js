const db = require('../../connections/db');

module.exports = function(userId, followsUserId) {
  let _userId = db.escape(userId);
  let _followsUserId = db.escape(followsUserId);
  return db.query(`DELETE FROM userFollowers WHERE userId=${_userId} AND followsUserId=${_followsUserId}`)
  .then((result) => {});
}
