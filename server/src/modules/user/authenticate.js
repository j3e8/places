const db = require('../../connections/db');
const encryptPassword = require('../../lib/encrypt-password');

module.exports = function(username, password) {
  let _username = db.escape(username);
  let _password = db.escape(encryptPassword(password));
  return db.query(`SELECT id, username, email, dateCreated, userType
    FROM users
    WHERE (username=${_username} OR email=${_username})
    AND password=${_password}`)
  .then((rows) => {
    if (rows.length) {
      return Promise.resolve(rows[0]);
    }
    return Promise.reject({ code: 401, message: "Unauthorized" });
  });
}
