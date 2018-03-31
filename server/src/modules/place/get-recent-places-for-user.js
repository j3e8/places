const db = require('../../connections/db');
const ImageUtil = require('../../lib/image');

module.exports = function(userId) {
  let _userId = db.escape(userId);
  return db.query(`SELECT p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude,
    me.dateChecked, u.username, u.imgUrl, u.id as userId,
    COUNT(up.userId) as numberOfVisitors,
    COUNT(lp.listId) as numberOfLists
    FROM places AS p
    INNER JOIN userplaces AS me ON p.id=me.placeId AND me.userId=${_userId}
    INNER JOIN users AS u ON me.userId=u.id
    INNER JOIN placetypes AS pt ON p.placeTypeId=pt.id
    INNER JOIN listplaces AS lp ON p.id=lp.placeId
    INNER JOIN userplaces AS up ON p.id=up.placeId
    GROUP BY p.id
    ORDER BY me.dateChecked DESC
    LIMIT 10`
  ).then((results) => {
    results.forEach((result) => {
      result.shapeData = JSON.parse(result.shapeData);
      result.imgUrl = result.imgUrl ? result.imgUrl : ImageUtil.NO_IMAGE_URL;
      result.isChecked = true;
    });
    return Promise.resolve(results);
  });
}
