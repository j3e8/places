const db = require('../../connections/db');
const makeListObject = require('./sub/make-list-object');

module.exports = function(listId, requestBody) {
  let obj = makeListObject(listId, null, requestBody);
  return db.query(`UPDATE lists SET ? WHERE id=${listId}`, obj);
}
