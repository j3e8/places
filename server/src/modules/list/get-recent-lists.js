const db = require('../../connections/db');

module.exports = function(limit) {
  let _limit = db.escape(limit);
  return db.query(`SELECT l.id, l.listName, l.description, l.dateCreated, l.dateModified, l.creatorUserId, l.official, l.iconId,
    i.iconUrl,
    CASE WHEN u.userType = 'admin' AND l.official THEN 'kulana' ELSE u.username END AS username, u.prominence
    FROM lists as l
    INNER JOIN icons as i ON l.iconId=i.id
    INNER JOIN users as u ON l.creatorUserId=u.id
    WHERE l.status='active'
    ORDER BY l.dateCreated DESC
    LIMIT ${_limit}`);
}
