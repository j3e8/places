const db = require('../../connections/db');

module.exports = function(minLat, maxLat, minLng, maxLng) {
  let sql = `SELECT p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude, p.placeImgUrl,
    COUNT(up.userId) as numberOfVisitors,
    COUNT(lp.listId) as numberOfLists
    FROM places AS p
    INNER JOIN placetypes AS pt ON p.placeTypeId=pt.id
    LEFT JOIN listplaces AS lp ON p.id=lp.placeId
    LEFT JOIN userplaces AS up ON p.id=up.placeId
    WHERE p.minLatitude >= ${minLat}
      AND p.maxLatitude <= ${maxLat}
      AND p.minLongitude >= ${minLng}
      AND p.maxLongitude <= ${maxLng}
    GROUP BY p.id
    LIMIT 25`;

  console.log(sql);

  return db.query(sql)
  .then((results) => {
    results.forEach((result) => {
      result.shapeData = JSON.parse(result.shapeData);
    });
    return Promise.resolve(results);
  });
}
