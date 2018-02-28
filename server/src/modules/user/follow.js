const db = require('../../connections/db');

module.exports = function(userId, followsUserId) {
  let record = {
    userId: userId,
    followsUserId: followsUserId
  }
  return db.query(`REPLACE INTO userFollowers SET ?`, record)
  .then((result) => {});
}
