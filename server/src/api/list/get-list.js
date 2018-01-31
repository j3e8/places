const ListModule = require('../../modules/list');

module.exports = function(listId, user) {
  return ListModule.getList(listId, user ? user.id : null)
  .then((list) => {
    if (!list) {
      return Promise.reject({ code: 404, message: `List ${listId} not found` });
    }
    return Promise.resolve(list);
  });
}
