const db = require('../../connections/db');

module.exports = function(listId, userId) {
  if (userId) {
    return getPlacesForUserList(listId, userId);
  }
  return getPlacesForList(listId);
}

function getPlacesForUserList(listId, userId) {
  return db.query(`SELECT
    p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude,
    up.dateChecked, case when up.dateChecked is null then 0 else 1 end as isChecked, up.placeImgUrl, up.placeThumbUrl, up.placeDescription
    FROM listplaces as lp
    INNER JOIN places as p ON lp.placeId=p.id
    INNER JOIN placetypes AS pt ON p.placeTypeId=pt.id
    LEFT JOIN userplaces AS up ON up.placeId=p.id AND up.userId=${userId}
    WHERE lp.listId=${listId}
    ORDER BY lp.rank, p.placeName`
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
    p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude
    FROM listplaces as lp
    INNER JOIN places as p ON lp.placeId=p.id
    INNER JOIN placetypes AS pt ON p.placeTypeId=pt.id
    WHERE lp.listId=${listId}
    ORDER BY lp.rank, p.placeName`
  )
  .then((rows) => {
    rows.forEach((row) => {
      row.shapeData = JSON.parse(row.shapeData);
    });
    return Promise.resolve(rows);
  });
}
