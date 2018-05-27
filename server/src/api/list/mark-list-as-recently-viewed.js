const ListModule = require('../../modules/list');

module.exports = function(user, listId) {
  return ListModule.markListAsRecentlyViewed(user.id, listId)
  .then(() => 'ok');
}
