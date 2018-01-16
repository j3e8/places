const UserModule = require('../../modules/user');

module.exports = function(userId) {
  return UserModule.getUser(userId);
}
