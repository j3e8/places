app.service("Shape", function() {
  var Shape = {};

  Shape.POINT = 'point';
  Shape.POLYGON = 'polygon';
  Shape.POLYLINE = 'polyline';

  Shape.polygonFromGMPolygon = function(gmPolygon) {
    var pts = [];
    gmPolygon.getPath().forEach(function(latLng) {
      pts.push({
        lat: latLng.lat(),
        lng: latLng.lng()
      });
    });
    return pts;
  }

  Shape.pointFromGMMarker = function(gmMarker) {
    var latLng = gmMarker.getPosition();
    return {
      lat: latLng.lat(),
      lng: latLng.lng()
    }
  }

  return Shape;
})
