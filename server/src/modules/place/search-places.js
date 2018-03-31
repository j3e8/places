const db = require('../../connections/db');

module.exports = function(userId, search) {
  let _userId = db.escape(userId);
  let userSelect = userId ? `,me.dateChecked` : '';
  let userJoin = userId ? `LEFT JOIN userplaces as me ON p.id=me.placeId AND me.userId=${_userId}` : '';
  let _search = db.escape(`%${search}%`);

  return db.query(`SELECT p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude
    ${userSelect}
    FROM places AS p
    INNER JOIN placetypes AS pt ON p.placeTypeId=pt.id
    ${userJoin}
    WHERE p.placeName LIKE ${_search}
    LIMIT 25`
  ).then((results) => {
    results.forEach((result) => {
      result.shapeData = JSON.parse(result.shapeData);
    });
    return Promise.resolve(results);
  });
}
