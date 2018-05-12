const db = require('../../connections/db');

module.exports = function(limit) {
  let _limit = db.escape(limit);
  return db.query(`SELECT p.id, p.placeTypeId, pt.placeType,
    p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region, p.dateCreated,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude,
    u.username, u.id as userId
    FROM places AS p
    INNER JOIN placetypes AS pt ON p.placeTypeId=pt.id
    INNER JOIN users AS u ON p.creatorUserId=u.id
    WHERE p.status='active'
    ORDER BY p.dateCreated DESC
    LIMIT ${_limit}`);
}
