const db = require('../../connections/db');

module.exports = function(userId, search) {
  let _userId = db.escape(userId);
  let userSelect = userId ? `,me.dateFollowed` : '';
  let userJoin = userId ? `LEFT JOIN userlists as me ON l.id=me.listId AND me.userId=${_userId}` : '';
  let _search = db.escape(`%${search}%`);

  return db.query(`SELECT l.id, l.listName, l.description, l.dateCreated, l.dateModified, l.creatorUserId, l.official,
    CASE WHEN u.userType = 'admin' AND l.official THEN 'kulana' ELSE u.username END AS username, u.prominence,
    COUNT(lp.placeId) as numberOfPlaces, COUNT(distinct ul.userId) as numberOfFollowers
    ${userSelect}
    FROM lists as l
    INNER JOIN users as u ON l.creatorUserId=u.id
    INNER JOIN listplaces as lp ON l.id=lp.listId
    ${userJoin}
    LEFT JOIN userlists as ul ON l.id=ul.listId
    WHERE l.listName like ${_search} OR l.description like ${_search}
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
