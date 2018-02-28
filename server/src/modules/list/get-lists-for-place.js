const db = require('../../connections/db');

module.exports = function(userId, placeId) {
  let _userId = db.escape(userId);
  let _placeId = db.escape(placeId);
  let userClause = userId ? `LEFT JOIN userlists as me ON l.id=me.listId AND me.userId=${_userId}` : '';

  return db.query(`SELECT l.id, l.listName, l.description, l.dateCreated, l.dateModified, l.creatorUserId, l.official,
    CASE WHEN u.userType = 'admin' AND l.official THEN 'kulana' ELSE u.username END AS username, u.prominence,
    me.dateFollowed,
    COUNT(lp.placeId) as numberOfPlaces,
    COUNT(distinct ul.userId) as numberOfFollowers
    FROM lists as l
    INNER JOIN users as u ON l.creatorUserId=u.id
    INNER JOIN listplaces as lp ON l.id=lp.listId
    ${userClause}
    LEFT JOIN userlists as ul ON l.id=ul.listId
    WHERE l.id IN (SELECT DISTINCT listId FROM listplaces WHERE placeId=${_placeId})
    GROUP BY l.id, u.username
    ORDER BY u.prominence DESC, numberOfFollowers DESC, l.listName
    LIMIT 25
  `)
  .then((rows) => {
    rows.forEach((row) => {
      row.official = row.official ? true : false;
    });
    return Promise.resolve(rows);
  });
}
