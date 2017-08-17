let jwt = require('../modules/jwt').jwt;
let UserHelper = require('../modules/user-helper');
let User = {};

User.authenticate = function(requestBody) {
  return UserHelper.authenticate(requestBody.username, requestBody.password)
  .then((user) => jwt.sign(user));
}

User.create = function(requestBody) {
  return UserHelper.create(requestBody.username, requestBody.email, requestBody.password)
  .then((user) => jwt.sign(user));
}

User.get = function(userId) {
  return UserHelper.get(userId);
}

module.exports = User;
