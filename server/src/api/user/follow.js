const UserModule = require('../../modules/user');

module.exports = function(userId, followsUserId, authenticatedUser) {
  if (!authenticatedUser || authenticatedUser.id !== Number(userId)) {
    return Promise.reject({ code: 401, message: "You can't follow on behalf of someone else" });
  }
  return UserModule.follow(userId, followsUserId);
}
