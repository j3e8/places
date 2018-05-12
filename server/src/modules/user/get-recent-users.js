const db = require('../../connections/db');
const ImageUtil = require('../../lib/image');

module.exports = function(limit) {
  let _limit = db.escape(limit);
  return db.query(`SELECT u.id, u.username, u.email, u.dateCreated, u.userType, u.imgUrl, u.bio
    FROM users as u
    WHERE u.status='active'
    ORDER BY u.dateCreated DESC
    LIMIT ${_limit}`)
  .then((rows) => {
    rows.forEach((user) => {
      user.imgUrl = user.imgUrl ? user.imgUrl : ImageUtil.NO_IMAGE_URL;
    });
    return Promise.resolve(rows);
  });
}
