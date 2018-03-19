const db = require('../../connections/db');
const ImageUtil = require('../../lib/image');
const getRecentPlacesForUser = require('./get-recent-places-for-user');

module.exports = function(userId) {
  let places;

  let _userId = db.escape(userId);
  return db.query(`SELECT friendplaces.placeId,
    p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude,
    friendplaces.dateChecked, friendplaces.userId, friends.username, friends.imgUrl
    FROM places AS p
    INNER JOIN userplaces AS friendplaces ON p.id=friendplaces.placeId
    INNER JOIN users AS friends on friendplaces.userId=friends.id
    INNER JOIN userFollowers AS uf ON friendplaces.userId=uf.followsUserId AND uf.userId=${_userId}
    INNER JOIN placeTypes AS pt ON p.placeTypeId=pt.id
    ORDER BY friendplaces.dateChecked DESC
    LIMIT 50`
  ).then((results) => {
    results.forEach((result) => {
      result.shapeData = JSON.parse(result.shapeData);
      result.imgUrl = result.imgUrl ? result.imgUrl :ImageUtil.NO_IMAGE_URL;
    });
    places = results;
    return getRecentPlacesForUser(userId);
  })
  .then((results) => {
    places = places.concat(results);
    return Promise.resolve(places);
  });
}
