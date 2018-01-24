const jwt = require('../../lib/jwt').jwt;
const UserModule = require('../../modules/user');

module.exports = function(headers, requestBody) {
  if (headers.authorization) {
    return jwt.decode(headers.authorization)
    .then((decoded) => jwt.sign({ user: decoded.user }));
  }
  else {
    return UserModule.authenticate(requestBody.username, requestBody.password)
    .then((user) => jwt.sign({ user: user }));
  }
}
