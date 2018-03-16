const db = require('../../connections/db');
const ImageUtil = require('../../lib/image');

module.exports = function(userId, search) {
  let _userId = db.escape(userId);
  let _search = db.escape(`%${search}%`);

  return db.query(`SELECT u.id, u.username, u.email, u.dateCreated, u.userType, u.imgUrl, u.bio,
    COUNT(uf.userId) AS numberOfFollowers,
    CASE WHEN me.userId IS NOT NULL THEN 1 ELSE 0 END AS isFollowed
    FROM users AS u
    LEFT JOIN userFollowers AS uf ON u.id=uf.followsUserId
    LEFT JOIN userFollowers as me ON u.id=me.followsUserId AND me.userId=${_userId}
    WHERE u.username LIKE ${_search}
    GROUP BY u.id
    LIMIT 25
  `)
  .then((rows) => {
    rows.forEach((user) => {
      user.imgUrl = user.imgUrl ? user.imgUrl : ImageUtil.NO_IMAGE_URL;
    });
    return Promise.resolve(rows);
  });
}
