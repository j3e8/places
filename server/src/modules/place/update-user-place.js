const db = require('../../connections/db');
const updatePlaceImage = require('./sub/update-place-image');
const moment = require('moment');

module.exports = function(userId, placeId, place) {
  let obj = {
    userId: userId,
    placeId: placeId
  }

  let dateChecked;
  if (place.dateChecked) {
    dateChecked = moment(place.dateChecked).format("YYYY-MM-DD HH:mm:ss");
  }
  else if (place.isChecked) {
    dateChecked = moment().format("YYYY-MM-DD HH:mm:ss");
  }
  if (dateChecked) {
    obj.dateChecked = dateChecked;
  }
  if (place.placeDescription !== undefined) {
    obj.placeDescription = place.placeDescription;
  }

  return updatePlaceImage(userId, placeId, place.img_file, place.img_file_thumb)
  .then((results) => {
    if (results.placeImgUrl) {
      obj.placeImgUrl = results.placeImgUrl;
    }
    if (results.placeThumbUrl) {
      obj.placeThumbUrl = results.placeThumbUrl;
    }
    return db.query(`REPLACE INTO userplaces SET ?`, obj);
  })
  .then((result) => db.query(`SELECT dateChecked, placeImgUrl, placeThumbUrl, placeDescription
    FROM userplaces
    WHERE userId=${userId}
    AND placeId=${placeId}
  `))
  .then((rows) => {
    let userplace = Object.assign({}, obj, rows[0]);
    return Promise.resolve(userplace);
  });
}
