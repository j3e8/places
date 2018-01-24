module.exports = function(listId, userId, data) {
  if (!data || !userId) {
    return null;
  }
  return {
    id: listId || undefined,
    creatorUserId: userId || undefined,
    listName: data.listName || undefined,
    description: data.description || undefined
  }
}
