const db = require('../../connections/db');

module.exports = function(userId) {
  let _userId = db.escape(userId);
  let userClause = userId ? `LEFT JOIN userlists as me ON l.id=me.listId AND me.userId=${_userId}` : '';

  return db.query(`SELECT l.id, l.listName, l.description, l.dateCreated, l.dateModified, l.creatorUserId,
    u.username, u.prominence, me.dateFollowed, COUNT(lp.placeId) as numberOfPlaces, COUNT(distinct ul.userId) as numberOfFollowers
    FROM lists as l
    INNER JOIN users as u ON l.creatorUserId=u.id
    INNER JOIN listplaces as lp ON l.id=lp.listId
    ${userClause}
    LEFT JOIN userlists as ul ON l.id=ul.listId
    GROUP BY l.id, u.username
    ORDER BY u.prominence DESC
    LIMIT 10
  `);
}
