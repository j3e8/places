const ListModule = require('../../modules/list');

module.exports = function(listId, userId) {
  return ListModule.getList(listId, userId)
  .then((list) => {
    if (!list) {
      return Promise.reject({ code: 404, message: `List ${listId} not found` });
    }
    return Promise.resolve(list);
  });
}
