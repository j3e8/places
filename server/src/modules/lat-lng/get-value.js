module.exports = function(minmax, prop, shapeData) {
  if (Object.prototype.toString.call(shapeData) == '[object Array]') {
    let val;
    shapeData.forEach((s) => {
      if (minmax == 'max' && (val === undefined || s[prop] > val)) {
        val = s[prop];
      }
      else if (minmax == 'min' && (val === undefined || s[prop] < val)) {
        val = s[prop];
      }
    });
    return val;
  }
  else {
    return shapeData[prop];
  }
}
