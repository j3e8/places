const db = require('../../connections/db');

module.exports = function(str) {
  let _str = str.replace(/'/g, "\\'");
  return db.query(`SELECT p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude
    FROM places AS p
    INNER JOIN placeTypes AS pt ON p.placeTypeId=pt.id
    WHERE p.placeName LIKE '%${_str}%'`
  ).then((results) => {
    results.forEach((result) => {
      result.shapeData = JSON.parse(result.shapeData);
    });
    return Promise.resolve(results);
  });
}
