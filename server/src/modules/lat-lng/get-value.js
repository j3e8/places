module.exports = function getValue(minmax, prop, shapeData) {
  if (Object.prototype.toString.call(shapeData) == '[object Array]') {
    let val;
    shapeData.forEach((s) => {
      var thisVal = s[prop];

      if (Object.prototype.toString.call(s) == '[object Array]') {
        thisVal = getValue(minmax, prop, s);
      }

      if (minmax == 'max' && (val === undefined || thisVal > val)) {
        val = thisVal;
      }
      else if (minmax == 'min' && (val === undefined || thisVal < val)) {
        val = thisVal;
      }
    });
    return val;
  }
  else {
    return shapeData[prop];
  }
}
