const db = require('../../connections/db');
const LatLng = require('../lat-lng');

module.exports = function(user, placeId, place) {
  let minLatitude = LatLng.getMinLatitudeFromShapeData(place.shapeData);
  let maxLatitude = LatLng.getMaxLatitudeFromShapeData(place.shapeData);
  let minLongitude = LatLng.getMinLongitudeFromShapeData(place.shapeData);
  let maxLongitude = LatLng.getMaxLongitudeFromShapeData(place.shapeData);
  let obj = {
    'id': placeId,
    'placeName': place.placeName,
    'minLatitude': minLatitude,
    'minLongitude': minLongitude,
    'maxLatitude': maxLatitude,
    'maxLongitude': maxLongitude,
    'placeTypeId': place.placeTypeId,
    'region': place.region,
    'shapeType': place.shapeType,
    'shapeData': JSON.stringify(place.shapeData),
    'creatorUserId': user.id
  }
  console.log(`update into places set ? where id=${placeId}`, obj);
  return db.query(`UPDATE places SET ? WHERE id=${placeId}`, obj)
  .then((result) => {
    return Promise.resolve(obj);
  });
}
