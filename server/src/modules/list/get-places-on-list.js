const db = require('../../connections/db');

module.exports = function(listId) {
  return db.query(`SELECT
    p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId
    FROM listplaces as lp
    INNER JOIN places as p ON lp.placeId=p.id
    WHERE lp.listId=${listId}
    ORDER BY lp.rank`);
}
