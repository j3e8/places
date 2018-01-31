const db = require('../../connections/db');
const getPlacesOnList = require('./get-places-on-list');

module.exports = function(userId) {
  let _userId = db.escape(userId);
  return db.query(`SELECT l.id, l.listName, l.description, l.dateCreated, l.dateModified,
    u.username, u.prominence, tmp.numberOfPlaces
    FROM lists as l
    INNER JOIN users as u ON l.creatorUserId=u.id
    INNER JOIN (
      SELECT l.id, COUNT(lp.placeId) as numberOfPlaces
      FROM lists as l
      INNER JOIN listplaces as lp ON l.id=lp.listId
      GROUP BY l.id
    ) as tmp ON l.id=tmp.id
    WHERE u.id=${_userId}
  `);
}
