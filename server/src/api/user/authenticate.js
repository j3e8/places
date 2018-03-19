const jwt = require('../../lib/jwt').jwt;
const UserModule = require('../../modules/user');

module.exports = function(headers, requestBody) {
  if (headers.authorization) {
    return jwt.decode(headers.authorization)
    .then((decoded) => jwt.sign({ user: decoded.user }))
    .catch((err) => auth(requestBody.username, requestBody.password));
  }
  else {
    return auth(requestBody.username, requestBody.password);
  }
}

function auth(username, password) {
  return UserModule.authenticate(username, password)
  .then((user) => jwt.sign({ user: user }));
}
