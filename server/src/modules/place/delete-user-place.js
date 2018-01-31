const db = require('../../connections/db');

module.exports = function(userId, placeId) {
  let _userId = db.escape(userId);
  let _placeId = db.escape(placeId);
  return db.query(`DELETE FROM userplaces WHERE userId=${_userId} AND placeId=${_placeId}`);
}
