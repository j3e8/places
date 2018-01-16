const db = require('../../connections/db');
const encryptPassword = require('../../lib/encrypt-password');
const getUser = require('./get-user');

module.exports = function(username, email, password) {
  let user = {
    'username': username,
    'email': email,
    'password': encryptPassword(password)
  }
  return db.query(`INSERT INTO users SET ?`, user)
  .then((result) => getUser(result.insertId));
}
