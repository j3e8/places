const db = require('../../connections/db');

module.exports = function(userId, placeId, place) {
  let obj = {
    userId: userId,
    placeId: placeId
  }
  console.log(`REPLACE INTO userplaces SET ?`, obj);
  return db.query(`REPLACE INTO userplaces SET ?`, obj)
  .then((result) => db.query(`SELECT dateChecked
    FROM userplaces
    WHERE userId=${userId}
    AND placeId=${placeId}
  `))
  .then((rows) => {
    let userplace = Object.assign({}, obj, rows[0]);
    return Promise.resolve(userplace);
  });
}
