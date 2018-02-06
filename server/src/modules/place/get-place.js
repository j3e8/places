const db = require('../../connections/db');

module.exports = function(placeId) {
  let _placeId = db.escape(placeId);
  return db.query(`SELECT p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId
    FROM places AS p
    INNER JOIN placeTypes AS pt ON p.placeTypeId=pt.id
    WHERE p.id=${_placeId}`
  ).then((rows) => {
    if (rows && rows.length) {
      let place = rows[0];
      place.shapeData = JSON.parse(place.shapeData);
      return Promise.resolve(place);
    }
    return Promise.resolve(null);
  });
}
