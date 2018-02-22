const ListModule = require('../../modules/list');

module.exports = function(user, query) {
  if (query.placeId) {
    return ListModule.getListsForPlace(user ? user.id : null, query.placeId);
  }
  return ListModule.getPopularLists(user ? user.id : null);
}
