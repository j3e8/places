const db = require('../../connections/db');
const makeListObject = require('./sub/make-list-object');

module.exports = function(userId, data) {
  let list = makeListObject(null, userId, data);
  return db.query(`INSERT INTO lists SET ?`, list)
  .then((result) => {
    list.id = result.insertId;
    return Promise.resolve(list);
  });
}
