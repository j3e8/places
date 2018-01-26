module.exports = function(listId, userId, data) {
  if (!data) {
    return null;
  }
  let obj = {
    listName: data.listName || undefined,
    description: data.description || undefined
  }
  if (listId) {
    obj.id = listId;
  }
  if (userId) {
    obj.creatorUserId = userId;
  }
  return obj;
}
