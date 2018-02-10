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

  Shape.gmPolygonFromPolygon = function(shapeData) {
    var gmObject = new google.maps.Polygon({
      paths: shapeData,
      strokeColor: '#c67788',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#ef8f9f',
      fillOpacity: 0.4
    });
    return gmObject;
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

  Shape.shapeDataFromGeoJson = function(geojson) {
    if (!geojson.geometry) {
      throw "Invalid JSON. Missing 'geometry' property";
    }
    if (!geojson.geometry.type) {
      throw "Invalid JSON. Missing 'geometry.type' property";
    }
    if (!geojson.geometry.coordinates) {
      throw "Invalid JSON. Missing 'geometry.coordinates' property";
    }
    switch (geojson.geometry.type.toLowerCase()) {
      case 'polygon': return shapeDataFromGeoJsonPolygon(geojson.geometry.coordinates);
      case 'multipolygon': return shapeDataFromGeoJsonMultiPolygon(geojson.geometry.coordinates);
      default:
        throw "Unsupported geometry type";
        break;
    }
  }

  function shapeDataFromGeoJsonPolygon(data) {
    var place = [];
    data.forEach(function(poly) {
      var shape = [];
      poly.forEach(function(pt) {
        var lat = pt[1];
        var lng = pt[0];
        shape.push({ lat: lat, lng: lng });
      });
      place.push(shape);
    });
    return place;
  }

  function shapeDataFromGeoJsonMultiPolygon(data) {
    var place = [];
    data.forEach(function(poly) {
      poly.forEach(function(poly2) {
        var shape = [];
        poly2.forEach(function(pt) {
          var lat = pt[1];
          var lng = pt[0];
          shape.push({ lat: lat, lng: lng });
        });
        place.push(shape);
      });
    });
    return place;
  }

  Shape.boundsContains = function(container, contained) {
    if (container.minLat <= contained.minLat && container.maxLat >= contained.maxLat && container.minLng <= contained.minLng && container.maxLng >= contained.maxLng) {
      return true;
    }
    return false;
  }

  Shape.calculateBounds = function(shapeData) {
    var minLat, maxLat, minLng, maxLng;
    if (Object.prototype.toString.call(shapeData) == '[object Array]') {
      minLat = findMinProperty(shapeData, 'lat');
      maxLat = findMaxProperty(shapeData, 'lat');
      minLng = findMinProperty(shapeData, 'lng');
      maxLng = findMaxProperty(shapeData, 'lng');
    }
    else {
      minLat = shapeData.lat;
      maxLat = shapeData.lat;
      minLng = shapeData.lng;
      maxLng = shapeData.lng;
    }
    return {
      minLat: minLat,
      maxLat: maxLat,
      minLng: minLng,
      maxLng: maxLng
    }
  }

  Shape.getCenterOfShape = function(shapeData) {
    var bounds = Shape.calculateBounds(shapeData);
    return {
      lat: (bounds.minLat + bounds.maxLat) / 2,
      lng: (bounds.minLng + bounds.maxLng) / 2
    }
  }

  function findMinProperty(arr, prop) {
    var val;
    arr.forEach(function(item) {
      var thisVal = item[prop];
      if (Object.prototype.toString.call(item) == '[object Array]') {
        thisVal = findMinProperty(item, prop);
      }
      if (thisVal !== undefined && (val === undefined || thisVal < val)) {
        val = thisVal;
      }
    });
    return val;
  }

  function findMaxProperty(arr, prop) {
    var val;
    arr.forEach(function(item) {
      var thisVal = item[prop];
      if (Object.prototype.toString.call(item) == '[object Array]') {
        thisVal = findMaxProperty(item, prop);
      }
      if (thisVal !== undefined && (val === undefined || thisVal > val)) {
        val = thisVal;
      }
    });
    return val;
  }

  return Shape;
})
