const db = require('../../connections/db');

module.exports = function(listId, userId) {
  if (userId) {
    return getPlacesForUserList(listId, userId);
  }
  return getPlacesForList(listId);
}

function getPlacesForUserList(listId, userId) {
  return db.query(`SELECT
    p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId,
    up.dateChecked, case when up.dateChecked is null then 0 else 1 end as isChecked
    FROM listplaces as lp
    INNER JOIN places as p ON lp.placeId=p.id
    INNER JOIN placeTypes AS pt ON p.placeTypeId=pt.id
    LEFT JOIN userplaces AS up ON up.placeId=p.id AND up.userId=${userId}
    WHERE lp.listId=${listId}
    ORDER BY lp.rank`
  )
  .then((rows) => {
    rows.forEach((row) => {
      row.shapeData = JSON.parse(row.shapeData);
      row.isChecked = row.isChecked ? true : false;
    });
    return Promise.resolve(rows);
  });
}

function getPlacesForList(listId) {
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
