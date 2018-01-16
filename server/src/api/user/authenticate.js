const jwt = require('../../lib/jwt').jwt;
const UserModule = require('../../modules/user');

module.exports = function(requestBody) {
  return UserModule.authenticate(requestBody.username, requestBody.password)
  .then((user) => jwt.sign({ user: user }));
}
