const UserModule = require('../../modules/user');

module.exports = function(userId, requestBody) {
  return UserModule.updateUser(userId, requestBody);
}
