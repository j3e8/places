const db = require('../../connections/db');

module.exports = function(placeId) {
  let _placeId = db.escape(placeId);
  return db.query(`SELECT p.id, p.placeTypeId, pt.placeType,
    p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude,
    COUNT(up.userId) as numberOfVisitors
    FROM places AS p
    INNER JOIN placetypes AS pt ON p.placeTypeId=pt.id
    LEFT JOIN userplaces AS up ON p.id=up.placeId
    WHERE p.id=${_placeId}
    GROUP BY p.id`
  ).then((rows) => {
    if (rows && rows.length) {
      let place = rows[0];
      place.shapeData = JSON.parse(place.shapeData);
      return Promise.resolve(place);
    }
    return Promise.resolve(null);
  });
}
