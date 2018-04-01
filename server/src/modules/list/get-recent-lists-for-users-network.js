const db = require('../../connections/db');
const ImageUtil = require('../../lib/image');
const getRecentListsForUser = require('./get-recent-lists-for-user');

module.exports = function(userId) {
  let lists;

  let _userId = db.escape(userId);
  return db.query(`SELECT friendlists.listId, l.listName, l.description, l.dateCreated, l.dateModified, l.creatorUserId, l.official, l.iconId,
    i.iconUrl,
    friendlists.dateFollowed, friendlists.userId, friends.username, friends.imgUrl
    FROM lists AS l
    INNER JOIN icons AS i on l.iconId=i.id
    INNER JOIN userlists AS friendlists ON l.id=friendlists.listId
    INNER JOIN users AS friends on friendlists.userId=friends.id
    INNER JOIN userFollowers AS uf ON friendlists.userId=uf.followsUserId AND uf.userId=${_userId}
    ORDER BY friendlists.dateFollowed DESC
    LIMIT 50`
  ).then((results) => {
    results.forEach((result) => {
      result.imgUrl = result.imgUrl ? result.imgUrl : ImageUtil.NO_IMAGE_URL;
    });
    lists = results;
    return getRecentListsForUser(userId);
  })
  .then((results) => {
    lists = lists.concat(results);
    return Promise.resolve(lists);
  });
}
