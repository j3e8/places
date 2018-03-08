const UserModule = require('../../modules/user');

module.exports = function(user, query) {
  if (query.search) {
    return UserModule.searchUsers(user ? user.id : null, query.search);
  }
  return Promise.reject({ code: 400, message: "Must provide search params" });
}
