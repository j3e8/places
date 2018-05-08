const db = require('../../connections/db');
const updatePlaceImage = require('./sub/update-place-image');

module.exports = function(userId, placeId, place) {
  let obj = {
    userId: userId,
    placeId: placeId,
    placeDescription: place.description
  }

  return updatePlaceImage(userId, placeId, place.img_file)
  .then((imgUrl) => {
    if (imgUrl) {
      obj.placeImgUrl = imgUrl;
      let _imgUrl = db.escape(imgUrl);
    }
    return db.query(`REPLACE INTO userplaces SET ?, dateChecked=NOW()`, obj);
  })
  .then((result) => db.query(`SELECT dateChecked, placeImgUrl, placeDescription
    FROM userplaces
    WHERE userId=${userId}
    AND placeId=${placeId}
  `))
  .then((rows) => {
    let userplace = Object.assign({}, obj, rows[0]);
    return Promise.resolve(userplace);
  });
}
