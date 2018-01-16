const db = require('../../connections/db');
const encryptPassword = require('../../lib/encrypt-password');
const getUser = require('./get-user');

module.exports = function(userId, requestBody) {
  let _userId = db.escape(userId);
  let user = {
    'username': requestBody.username || undefined,
    'firstName': requestBody.firstName || undefined,
    'lastName': requestBody.lastName || undefined,
    'email': requestBody.email || undefined,
    'password': requestBody.password ? encryptPassword(password) : undefined
  }
  return db.query(`UPDATE users SET ? WHERE id=${_userId}`, user)
  .then((result) => getUser(userId));
}
