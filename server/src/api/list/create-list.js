const ListModule = require('../../modules/list');

module.exports = function(user, requestBody) {
  let listId;
  return ListModule.createList(user.id, requestBody)
  .then((l) => {
    listId = l.id;
    if (requestBody.places) {
      return ListModule.addPlacesToList(list.id, requestBody.places);
    }
  })
  .then(() => ListModule.getList(listId));
}
