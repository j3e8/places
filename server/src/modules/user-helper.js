let crypto = require('crypto');
let db = require('../connections/db');
let UserHelper = {};

UserHelper.authenticate = function(username, password) {
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

UserHelper.create = function(username, email, password) {
  let user = {
    'username': username,
    'email': email,
    'password': encryptPassword(password)
  }
  return db.query(`INSERT INTO users SET ?`, user)
  .then((result) => UserHelper.get(result.insertId));
}

UserHelper.get = function(userId) {
  let _id = db.escape(userId);
  return db.query(`SELECT id, username, email, dateCreated, userType FROM users WHERE id=${_id}`)
  .then((rows) => {
    if (rows.length) {
      return Promise.resolve(rows[0]);
    }
    return Promise.reject({ code: 404, message: "User not found" });
  })
}

function encryptPassword(password) {
  return crypto.createHash('sha256').update(password).digest('base64');
}

module.exports = UserHelper;
