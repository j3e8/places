const db = require('../../connections/db');

module.exports = function(userId, listId) {
  let _userId = db.escape(userId);
  let _listId = db.escape(listId);
  return db.query(`DELETE FROM userlists WHERE userId=${_userId} AND listId=${_listId}`);
}
