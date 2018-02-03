const db = require('../../connections/db');

module.exports = function(userId) {
  let _userId = db.escape(userId);
  return db.query(`SELECT l.id, l.listName, l.description, l.dateCreated, l.dateModified,
    u.username,
    tmp.numberOfPlaces, tmp.numberOfVisited
    FROM lists as l
    INNER JOIN users AS u ON l.creatorUserId=u.id
    INNER JOIN userlists as ul ON l.id=ul.listId and ul.userId=${_userId}
    INNER JOIN (
      SELECT l.id, COUNT(lp.placeId) as numberOfPlaces, COUNT(up.placeId) as numberOfVisited
      FROM lists as l
      INNER JOIN listplaces as lp ON l.id=lp.listId
      LEFT JOIN userplaces as up ON up.placeId=lp.placeId AND up.userId=${_userId}
      GROUP BY l.id
    ) as tmp ON l.id=tmp.id
  `);
}
