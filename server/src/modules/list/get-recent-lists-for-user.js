const db = require('../../connections/db');
const ImageUtil = require('../../lib/image');

module.exports = function(userId) {
  let _userId = db.escape(userId);
  return db.query(`SELECT l.id, l.listName, l.description, l.dateCreated, l.dateModified, l.creatorUserId, l.official, l.iconId,
    COALESCE(i.iconUrl, '${ImageUtil.DEFAULT_LIST_ICON_URL}') as iconUrl,
    me.dateFollowed,
    u.username, COALESCE(u.imgUrl, '${ImageUtil.NO_IMAGE_URL}') as imgUrl, u.id as userId
    FROM lists AS l
    INNER JOIN userlists AS me ON l.id=me.listId AND me.userId=${_userId}
    INNER JOIN users AS u ON me.userId=u.id
    LEFT JOIN icons AS i ON l.iconId=i.id
    ORDER BY me.dateFollowed DESC
    LIMIT 10`
  );
}
