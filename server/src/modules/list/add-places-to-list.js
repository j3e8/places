const db = require('../../connections/db');

module.exports = function(listId, places) {
  let iter = places.entries();
  return iteratePlaces(listId, iter);
}

function iteratePlaces(listId, iter) {
  let iteration = iter.next();
  if (iteration.done) {
    return Promise.resolve();
  }
  let place = iteration.value[1];
  let record = {
    listId: listId,
    placeId: place.id,
    rank: place.rank || 0
  }
  return db.query(`REPLACE INTO listplaces SET ?`, record)
  .then(() => iteratePlaces(listId, iter));
}
