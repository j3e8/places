const db = require('../../connections/db');

module.exports = function() {
  return db.query(`SELECT p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude,
    COUNT(up.userId) as numberOfVisitors,
    COUNT(lp.listId) as numberOfLists
    FROM places AS p
    INNER JOIN placeTypes AS pt ON p.placeTypeId=pt.id
    INNER JOIN listplaces AS lp ON p.id=lp.placeId
    INNER JOIN userplaces AS up ON p.id=up.placeId
    GROUP BY p.id
    ORDER BY numberOfVisitors DESC
    LIMIT 25`
  ).then((results) => {
    results.forEach((result) => {
      result.shapeData = JSON.parse(result.shapeData);
    });
    return Promise.resolve(results);
  });
}
