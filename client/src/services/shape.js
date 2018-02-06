app.service("Shape", function() {
  var Shape = {};

  Shape.POINT = 'point';
  Shape.POLYGON = 'polygon';
  Shape.POLYLINE = 'polyline';

  Shape.polygonFromGMPolygon = function(gmPolygon) {
    if (Object.prototype.toString.call(gmPolygon) == '[object Array]') {
      console.log('array of polygons');
      return gmPolygon.map(function(gmp) {
        var pts = [];
        gmp.getPath().forEach(function(latLng) {
          pts.push({ lat: latLng.lat(), lng: latLng.lng() });
        });
        return pts;
      });
    }
    else {
      console.log('single polygon');
      var paths = [];
      gmPolygon.getPaths().forEach(function(p) {
        var pts = [];
        p.forEach(function(latLng) {
          pts.push({ lat: latLng.lat(), lng: latLng.lng() });
        });
        paths.push(pts);
      });
      return paths;
    }
  }

  Shape.polylineFromGMPolyline = function(gmPolyline) {
    var pts = [];
    gmPolyline.getPath().forEach(function(latLng) {
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
