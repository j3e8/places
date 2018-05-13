const ListModule = require('../../modules/list');

module.exports = function(listId, forUserId, user) {
  return ListModule.getList(listId, forUserId, user.id)
  .then((list) => {
    if (!list) {
      return Promise.reject({ code: 404, message: `List ${listId} not found` });
    }
    return Promise.resolve(list);
  });
}
