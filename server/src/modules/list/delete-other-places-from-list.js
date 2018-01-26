const db = require('../../connections/db');

module.exports = function(listId, places) {
  let placeIdStr = places.map((p) => p.id).join(',');
  return db.query(`DELETE FROM listplaces
    WHERE listId=${listId}
    AND placeId NOT IN (${placeIdStr})`);
}
