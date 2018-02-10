const db = require('../../connections/db');
const M_PER_DEGREE_LAT = 111111;
const METERS_PER_MILE = 1609.34;

module.exports = function(lat, lng, radius) {
  let rad = calculateDegreeRadius(lat, lng, radius);
  let bounds = {
    minLat: lat - rad.lat,
    maxLat: Number(lat) + Number(rad.lat),
    minLng: lng - rad.lng,
    maxLng: Number(lng) + Number(rad.lng)
  }
  let mLat = milesPerLatitude(lat);
  let mLng = milesPerLongitude(lat);

  let sql = `SELECT p.id, p.placeTypeId, pt.placeType, p.placeName, p.shapeType, p.shapeData, p.creatorUserId, p.region,
    p.minLatitude, p.maxLatitude, p.minLongitude, p.maxLongitude,
    COUNT(up.userId) as numberOfVisitors,
    COUNT(lp.listId) as numberOfLists,
    SQRT(
      ((${lat} - (p.minLatitude + p.maxLatitude) / 2)*${mLat}) * ((${lat} - (p.minLatitude + p.maxLatitude) / 2)*${mLat})
      + ((${lng} - (p.minLongitude + p.maxLongitude) / 2)*${mLng}) * ((${lng} - (p.minLongitude + p.maxLongitude) / 2)*${mLng})
    ) as distance
    FROM places AS p
    INNER JOIN placeTypes AS pt ON p.placeTypeId=pt.id
    LEFT JOIN listplaces AS lp ON p.id=lp.placeId
    LEFT JOIN userplaces AS up ON p.id=up.placeId
    WHERE p.minLatitude >= ${bounds.minLat}
      AND p.maxLatitude <= ${bounds.maxLat}
      AND p.minLongitude >= ${bounds.minLng}
      AND p.maxLongitude <= ${bounds.maxLng}
    GROUP BY p.id
    ORDER BY distance
    LIMIT 25`;

  console.log(sql);

  return db.query(sql)
  .then((results) => {
    results.forEach((result) => {
      result.shapeData = JSON.parse(result.shapeData);
    });
    return Promise.resolve(results);
  });
}

function calculateDegreeRadius(lat, lng, radius) {
  return {
    lat: radius / metersPerLatitude(lat),
    lng: radius / metersPerLongitude(lat)
  }
}

function metersPerLatitude(lat) {
  return M_PER_DEGREE_LAT;
}

function metersPerLongitude(lat) {
  let rlat = lat / 180 * Math.PI;
  let m = M_PER_DEGREE_LAT * Math.abs(Math.cos(rlat));
  return m;
}

function milesPerLatitude(lat) {
  return M_PER_DEGREE_LAT / METERS_PER_MILE;
}

function milesPerLongitude(lat) {
  let rlat = lat / 180 * Math.PI;
  let m = M_PER_DEGREE_LAT * Math.abs(Math.cos(rlat));
  return m / METERS_PER_MILE;
}
