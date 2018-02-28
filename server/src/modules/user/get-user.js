const db = require('../../connections/db');

module.exports = function(userId, authenticatedUser) {
  let _id = db.escape(userId);
  let _authUserId = db.escape(authenticatedUser ? authenticatedUser.id : null);
  return db.query(`SELECT u.id, u.username, u.email, u.dateCreated, u.userType, COUNT(uf.userId) AS numberOfFollowers,
    CASE WHEN me.userId IS NOT NULL THEN 1 ELSE 0 END AS isFollowed
    FROM users AS u
    LEFT JOIN userFollowers AS uf ON u.id=uf.followsUserId
    LEFT JOIN userFollowers AS me ON u.id=me.followsUserId AND me.userId=${_authUserId}
    WHERE id=${_id}
    GROUP BY u.id
  `)
  .then((rows) => {
    if (rows.length) {
      return Promise.resolve(rows[0]);
    }
    return null;
  });
}
