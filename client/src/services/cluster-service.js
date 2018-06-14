app.service("ClusterService", ["MapService", "PlaceService", "Shape", "$timeout", function(MapService, PlaceService, Shape, $timeout) {
  var ClusterService = {};
  var PX_TOLERANCE = 30;

  ClusterService.createClusterer = function(map, clickHandler) {
    var clusterer = {
      clickHandler: clickHandler,
      highlightedClusters: [],
      notVisitedClusters: [],
      visitedClusters: [],
      map: map,
      places: []
    };

    google.maps.event.addListener(map, 'zoom_changed', function() {
      ClusterService.update(clusterer);
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
      clusterer.mapReady = true;
      ClusterService.update(clusterer);
    });

    return clusterer;
  }

  ClusterService.addPlaceToClusterer = function(clusterer, place) {
    clusterer.places.push(place);
  }

  ClusterService.removePlaceFromClusterer = function(clusterer, place) {
    var place = clusterer.places.find(function(p) {
      return p.id == place.id;
    });
    if (place) {
      clusterer.places.splice(clusterer.places.indexOf(place), 1);
    }
  }

  ClusterService.update = function(clusterer) {
    clearTimeout(clusterer._something_changed_timeout);
    clusterer._something_changed_timeout = setTimeout(function() {
      calculate(clusterer);
    }, 400);
  }

  function calculate(clusterer) {
    if (!clusterer.mapReady || !clusterer.map || !clusterer.map.getBounds()) {
      return $timeout(calculate.bind(this, clusterer), 50);
    }

    var highlighted = [];
    var visited = [];
    var notVisited = [];
    clusterer.places.forEach(function(place) {
      if (place.highlighted) {
        highlighted.push(place);
      }
      else if (place.isChecked) {
        visited.push(place);
      }
      else {
        notVisited.push(place);
      }
    });

    var ne = clusterer.map.getBounds().getNorthEast();
    var sw = clusterer.map.getBounds().getSouthWest();
    var mapBounds = {
      minLat: sw.lat(),
      maxLat: ne.lat(),
      minLng: sw.lng(),
      maxLng: ne.lng()
    }

    var hc = createClusters(clusterer, highlighted).filter(function(c) { return isClusterWithinMapBounds(c, mapBounds); });
    // remove clusters no longer in array
    clusterer.highlightedClusters.forEach(function(c) {
      var found = hc.find(function(c2) { return c.hash == c2.hash; });
      if (!found) {
        MapService.removeClusterFromMap(c);
      }
    });
    // add clusters that are new
    hc.forEach(function(c) {
      var found = clusterer.highlightedClusters.find(function(c2) { return c.hash == c2.hash; });
      if (!found) {
        MapService.addClusterToMap(clusterer.map, c, clusterer.clickHandler);
      }
      else {
        c.gmObject = found.gmObject;
      }
    });
    clusterer.highlightedClusters = hc;

    var vc = createClusters(clusterer, visited).filter(function(c) { return isClusterWithinMapBounds(c, mapBounds); });
    // remove clusters no longer in array
    clusterer.visitedClusters.forEach(function(c) {
      var found = vc.find(function(c2) { return c.hash == c2.hash; });
      if (!found) {
        MapService.removeClusterFromMap(c);
      }
    });
    // add clusters that are new
    vc.forEach(function(c) {
      var found = clusterer.visitedClusters.find(function(c2) { return c.hash == c2.hash; });
      if (!found) {
        MapService.addClusterToMap(clusterer.map, c, clusterer.clickHandler);
      }
      else {
        c.gmObject = found.gmObject;
      }
    });
    clusterer.visitedClusters = vc;

    var nvc = createClusters(clusterer, notVisited).filter(function(c) { return isClusterWithinMapBounds(c, mapBounds); });
    // remove clusters no longer in array
    clusterer.notVisitedClusters.forEach(function(c) {
      var found = nvc.find(function(c2) { return c.hash == c2.hash; });
      if (!found) {
        MapService.removeClusterFromMap(c);
      }
    });
    // add clusters that are new
    nvc.forEach(function(c) {
      var found = clusterer.notVisitedClusters.find(function(c2) { return c.hash == c2.hash; });
      if (!found) {
        MapService.addClusterToMap(clusterer.map, c, clusterer.clickHandler);
      }
      else {
        c.gmObject = found.gmObject;
      }
    });
    clusterer.notVisitedClusters = nvc;
  }

  function isClusterWithinMapBounds(cluster, mapBounds) {
    var validLat, validLng;
    var PCT_BUFFER = 0.1;
    var DEGREE_BUFFER = (mapBounds.maxLat - mapBounds.minLat) * PCT_BUFFER;

    if (cluster.maxLat >= mapBounds.minLat - DEGREE_BUFFER && cluster.minLat <= mapBounds.maxLat + DEGREE_BUFFER) {
      validLat = true;
    }

    if (mapBounds.minLng > mapBounds.maxLng) {
      if (cluster.maxLng <= mapBounds.maxLng || cluster.minLng <= mapBounds.maxLng
        || cluster.maxLng >= mapBounds.minLng || cluster.minLng >= mapBounds.minLng)
      {
        validLng = true;
      }
    }
    else if (cluster.maxLng >= mapBounds.minLng - DEGREE_BUFFER && cluster.minLng <= mapBounds.maxLng + DEGREE_BUFFER) {
      validLng = true;
    }

    return validLat && validLng;
  }

  function createClusters(clusterer, places) {
    var clusters = [];
    var pigeon = [];
    places.forEach(function(place) {
      // find all places within tolerance
      var nearby = getClusterablePlaces(clusterer, place, places, pigeon);
      if (nearby && nearby.length) {
        var bounds = calculateBounds(nearby);
        var cluster = {
          highlighted: nearby[0].highlighted,
          minLat: bounds.minLat,
          maxLat: bounds.maxLat,
          minLng: bounds.minLng,
          maxLng: bounds.maxLng,
          isChecked: nearby[0].isChecked,
          places: nearby,
          hash: nearby.map(function(n) { return n.id; }).join(','),
          placeThumbUrl: chooseThumbUrl(nearby)
        }
        clusters.push(cluster);
      }
    });
    return clusters;
  }

  function chooseThumbUrl(places) {
    var valid = places.filter(function(p) {
      return p.placeThumbUrl;
    });
    if (!valid.length) {
      return undefined;
    }
    var r = Math.floor(Math.random() * valid.length);
    return valid[r].placeThumbUrl;
  }

  function calculateBounds(places) {
    var bounds = {};
    places.forEach(function(place) {
      var b = PlaceService.calculateBounds(place);
      if (bounds.minLat === undefined || b.minLat < bounds.minLat) bounds.minLat = b.minLat;
      if (bounds.maxLat === undefined || b.maxLat > bounds.maxLat) bounds.maxLat = b.maxLat;
      if (bounds.minLng === undefined || b.minLng < bounds.minLng) bounds.minLng = b.minLng;
      if (bounds.maxLng === undefined || b.maxLng > bounds.maxLng) bounds.maxLng = b.maxLng;
    });
    return bounds;
  }

  function getClusterablePlaces(clusterer, place, places, pigeon) {
    if (pigeon[places.indexOf(place)]) {
      return;
    }
    if (place.shapeType != 'point') {
      pigeon[places.indexOf(place)] = true;
      return [ place ];
    }
    var nearby = [];
    var topRight = clusterer.map.getProjection().fromLatLngToPoint(clusterer.map.getBounds().getNorthEast());
  	var bottomLeft = clusterer.map.getProjection().fromLatLngToPoint(clusterer.map.getBounds().getSouthWest());
  	var scale = Math.pow(2, clusterer.map.getZoom());

    var placeCenter = Shape.getCenterOfShape(place.shapeData);
    var placeLatLng = new google.maps.LatLng(placeCenter);
    var placePoint = clusterer.map.getProjection().fromLatLngToPoint(placeLatLng);
    var placeXY = new google.maps.Point((placePoint.x - bottomLeft.x) * scale, (placePoint.y - topRight.y) * scale);

    for (var i=0; i < places.length; i++) {
      if (pigeon[i]) {
        continue;
      }
      var p = places[i];
      var center = Shape.getCenterOfShape(p.shapeData);
      var latLng = new google.maps.LatLng(center);
      var worldPoint = clusterer.map.getProjection().fromLatLngToPoint(latLng);
      var xy = new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);

      var sqd = (placeXY.x - xy.x)*(placeXY.x - xy.x) + (placeXY.y - xy.y)*(placeXY.y - xy.y);
      if (sqd <= PX_TOLERANCE * PX_TOLERANCE) {
        pigeon[i] = true;
        nearby.push(p);
      }
    }
    return nearby;
  }

  return ClusterService;
}]);
