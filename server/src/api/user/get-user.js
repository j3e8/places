const UserModule = require('../../modules/user');

module.exports = function(userId, authenticatedUser) {
  return UserModule.getUser(userId, authenticatedUser);
}
