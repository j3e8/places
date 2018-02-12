module.exports = function convertToWesternCoordinates(shapeData) {
  if (Object.prototype.toString.call(shapeData) != '[object Array]') {
    if (shapeData.lng > 0) {
      return {
        lat: shapeData.lat,
        lng: shapeData.lng - 360
      }
    }
    return Object.assign({}, shapeData);
  }

  let newShapeData = shapeData.map((s) => {
    return convertToWesternCoordinates(s);
  });
  return newShapeData;
}
