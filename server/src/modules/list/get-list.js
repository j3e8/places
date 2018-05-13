const db = require('../../connections/db');
const PlaceModule = require('../place');

module.exports = function(listId, forUserId, userId) {
  if (!userId) {
    userId = forUserId;
  }
  let list;
  let _listId = db.escape(listId);
  let _userId = db.escape(userId);

  return db.query(`SELECT l.id, l.listName, l.description, l.dateCreated, l.dateModified, l.creatorUserId, l.official, l.iconId,
    i.iconUrl,
    CASE WHEN u.userType = 'admin' AND l.official THEN 'kulana' ELSE u.username END AS username, u.prominence,
    me.dateFollowed, CASE WHEN me.dateFollowed IS NOT NULL THEN 1 ELSE 0 END AS isFollowed,
    COUNT(distinct ul.userId) as numberOfFollowers
    FROM lists as l
    INNER JOIN icons as i ON l.iconId=i.id
    INNER JOIN users as u ON l.creatorUserId=u.id
    LEFT JOIN userlists as me ON l.id=me.listId AND me.userId=${_userId}
    LEFT JOIN userlists as ul ON l.id=ul.listId
    WHERE l.id=${_listId}
    GROUP BY l.id`)
  .then((rows) => {
    if (rows && rows.length) {
      list = rows[0];
      list.official = list.official ? true : false;
      list.isFollowed = list.isFollowed ? true : false;
      return PlaceModule.getPlacesOnList(listId, forUserId)
      .then((places) => {
        list.places = places;
        return Promise.resolve(list);
      });
    }
    return null;
  });
}
