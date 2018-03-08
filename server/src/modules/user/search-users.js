const db = require('../../connections/db');

module.exports = function(userId, search) {
  let _userId = db.escape(userId);
  let userSelect = userId ? `CASE WHEN me.userId IS NOT NULL THEN 1 ELSE 0 END AS isFollowed` : '';
  let userJoin = userId ? `LEFT JOIN userplaces as me ON p.id=me.placeId AND me.userId=${_userId}` : '';
  let _search = db.escape(`%${search}%`);

  return db.query(`SELECT u.id, u.username, u.email, u.dateCreated, u.userType,
    COUNT(uf.userId) AS numberOfFollowers
    ${userSelect}
    FROM users AS u
    LEFT JOIN userFollowers AS uf ON u.id=uf.followsUserId
    ${userJoin}
    WHERE u.username LIKE ${_search}
    GROUP BY u.id
    LIMIT 25
  `);
}
