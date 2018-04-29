const db = require('../../connections/db');
const LatLng = require('../lat-lng');
const updatePlaceImage = require('./sub/update-place-image');

module.exports = function(user, place) {
  let minLatitude = LatLng.getMinLatitudeFromShapeData(place.shapeData);
  let maxLatitude = LatLng.getMaxLatitudeFromShapeData(place.shapeData);
  let minLongitude = LatLng.getMinLongitudeFromShapeData(place.shapeData);
  let maxLongitude = LatLng.getMaxLongitudeFromShapeData(place.shapeData);
  let obj = {
    'placeName': place.placeName,
    'minLatitude': minLatitude,
    'minLongitude': minLongitude,
    'maxLatitude': maxLatitude,
    'maxLongitude': maxLongitude,
    'placeTypeId': place.placeTypeId,
    'placeDescription': place.description,
    'region': place.region,
    'shapeType': place.shapeType,
    'shapeData': JSON.stringify(place.shapeData),
    'creatorUserId': user.id
  }

  console.log('insert into places set', obj);
  return db.query(`INSERT INTO places SET ?`, obj)
  .then((result) => {
    obj.id = result.insertId;
    return updatePlaceImage(obj.id, place.img_file)
    .then((imgUrl) => {
      if (imgUrl) {
        let _imgUrl = db.escape(imgUrl);
        return db.query(`UPDATE places SET imgUrl=${_imgUrl} WHERE id=${obj.id}`);
      }
    });
  })
  .then(() => Promise.resolve(obj));
}
