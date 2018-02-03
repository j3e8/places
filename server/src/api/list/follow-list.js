const ListModule = require('../../modules/list');

module.exports = function(user, userId, listId) {
  if (user.id != userId) {
    return Promise.reject({ code: 401, message: 'Unauthorized access' });
  }
  return ListModule.followList(userId, listId)
  .then(() => '');
}
