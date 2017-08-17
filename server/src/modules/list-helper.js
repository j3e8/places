let db = require('../connections/db');
let ListHelper = {};

ListHelper.insert = function(user, list) {
  let obj = {
    'listName': list.listName,
    'creatorUserId': user.id
  }
  return db.write(`INSERT INTO lists SET ?`, obj);
}

module.exports = ListHelper;
