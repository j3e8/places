let db = require('../../connections/db');

module.exports = function(listId) {
  let list;
  let _listId = db.escape(listId);
  return db.query(`SELECT l.id, l.listName, l.description, l.dateCreated, l.dateModified,
    u.username, u.prominence
    FROM lists as l
    INNER JOIN users as u ON l.creatorUserId=u.id
    WHERE l.id=${_listId}`)
  .then((rows) => {
    if (rows && rows.length) {
      list = rows[0];
      return ListModule.getPlacesOnList(listId)
      .then((places) => {
        list.places = places;
        return Promise.resolve(list);
      });
    }
    return null;
  });
}
