const db = require('../../connections/db');

module.exports = function(userId, listId) {
  let _userId = db.escape(userId);
  let _listId = db.escape(listId);
  return db.query(`SELECT dateFollowed FROM userlists WHERE userId=${_userId} AND listId=${_listId}`)
  .then((rows) => {
    if (rows && rows.length) {
      return Promise.resolve();
    }
    return db.query(`INSERT INTO userlists SET userId=${_userId}, listId=${_listId}`);
  });
}
