const UserModule = require('../../modules/user');

module.exports = function(user) {
  if (user.userType != 'admin') {
    return Promise.reject({ code: 401, message: "Unauthorized, you fool" });
  }

  return UserModule.getRecentUsers(50);
}
