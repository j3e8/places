const ListModule = require('../../modules/list');

module.exports = function(user) {
  return ListModule.getPopularLists(user ? user.id : null);
}
