const ListModule = require('../../modules/list');

module.exports = function(user, listId, requestBody) {
  return ListModule.updateList(listId, requestBody)
  .then(() => {
    if (requestBody.places && requestBody.places.length) {
      return ListModule.deleteOtherPlacesFromList(listId, requestBody.places)
      .then(() => ListModule.addPlacesToList(listId, requestBody.places));
    }
  })
  .then(() => ListModule.getList(listId, user.id));
}
