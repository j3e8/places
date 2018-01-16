let db = require('../../connections/db');
let PlaceHelper = {};

PlaceHelper.insert = function(user, place) {
  let minLatitude = 0;
  let maxLatitude = 0;
  let minLongitude = 0;
  let maxLongitude = 0;
  let obj = {
    'placeName': place.placeName,
    'minLatitude': minLatitude,
    'minLongitude': minLongitude,
    'maxLatitude': maxLatitude,
    'maxLongitude': maxLongitude,
    'placeTypeId': place.placeTypeId,
    'shapeType': place.shapeType,
    'shapeData': JSON.stringify(place.shapeData),
    'creatorUserId': user.id
  }
  console.log('insert into places set', obj);
  return db.query(`INSERT INTO places SET ?`, obj);
}

module.exports = PlaceHelper;
