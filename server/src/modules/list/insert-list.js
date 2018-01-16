let db = require('../../connections/db');

module.exports = function(user, list) {
  let obj = {
    'listName': list.listName,
    'creatorUserId': user.id
  }
  return db.write(`INSERT INTO lists SET ?`, obj);
}
