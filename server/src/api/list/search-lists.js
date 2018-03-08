const ListModule = require('../../modules/list');

module.exports = function(user, query) {
  if (query.search) {
    return ListModule.searchLists(user ? user.id : null, query.search);
  }
  else if (query.placeId) {
    return ListModule.getListsForPlace(user ? user.id : null, query.placeId);
  }
  return ListModule.getPopularLists(user ? user.id : null);
}
