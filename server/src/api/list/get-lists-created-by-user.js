const ListModule = require('../../modules/list');

module.exports = function(userId) {
  return ListModule.getListsCreatedByUser(userId);
}
