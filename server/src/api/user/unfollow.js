const UserModule = require('../../modules/user');

module.exports = function(userId, followsUserId, authenticatedUser) {
  if (!authenticatedUser || authenticatedUser.id !== Number(userId)) {
    return Promise.reject({ code: 401, message: "You can't unfollow on behalf of someone else" });
  }
  return UserModule.unfollow(userId, followsUserId);
}
