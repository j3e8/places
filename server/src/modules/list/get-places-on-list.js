const db = require('../../connections/db');

module.exports = function(listId) {
  return db.query(`SELECT
    p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId
    FROM listplaces as lp
    INNER JOIN places as p ON lp.placeId=p.id
    INNER JOIN placeTypes AS pt ON p.placeTypeId=pt.id
    WHERE lp.listId=${listId}
    ORDER BY lp.rank`
  )
  .then((rows) => {
    rows.forEach((row) => {
      row.shapeData = JSON.parse(row.shapeData);
    });
    return Promise.resolve(rows);
  });
}
