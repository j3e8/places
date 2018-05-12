const ListModule = require('../../modules/list');

module.exports = function(user) {
  if (user.userType != 'admin') {
    return Promise.reject({ code: 401, message: "Unauthorized, you fool" });
  }

  return ListModule.getRecentLists(50);
}
