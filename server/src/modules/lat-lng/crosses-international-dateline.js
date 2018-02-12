module.exports = function crossesInternationalDateline(shapeData) {
  if (Object.prototype.toString.call(shapeData) != '[object Array]') {
    return false;
  }

  let east = false;
  let west = false;

  for (let i=0; i < shapeData.length; i++) {
    let s = shapeData[i];
    if (Object.prototype.toString.call(s) == '[object Array]') {
      if (crossesInternationalDateline(s)) {
        return true;
      }
      continue;
    }

    let hemi = s.lng < 0 ? 'west' : 'east';
    if (s.lng < -160) {
      west = true;
    }
    if (s.lng > 160) {
      east = true;
    }

    if (east && west) {
      console.log('has both hemispheres');
      return true;
    }
  }

  return false;
}
