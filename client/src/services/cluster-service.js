app.service("ClusterService", ["MapService", "Shape", function(MapService, Shape) {
  var ClusterService = {};
  var PX_TOLERANCE = 30;

  ClusterService.createClusterer = function(map, clickHandler) {
    var clusterer = {
      clickHandler: clickHandler,
      notVisitedClusters: [],
      visitedClusters: [],
      map: map,
      places: []
    };

    google.maps.event.addListener(map, 'zoom_changed', function() {
      ClusterService.update(clusterer);
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
      clearTimeout(clusterer._bounds_changed_timeout);
      clusterer._bounds_changed_timeout = setTimeout(function() {
        removeClustersFromMap(clusterer);
        addClustersToMap(clusterer);
      }, 50);
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
      clusterer.places.splice(clusterer.indexOf(place), 1);
    }
  }

  ClusterService.update = function(clusterer) {
    calculate(clusterer);
  }

  function calculate(clusterer) {
    removeClustersFromMap(clusterer);

    var visited = [];
    var notVisited = [];
    clusterer.places.forEach(function(place) {
      if (place.isChecked) {
        visited.push(place);
      }
      else {
        notVisited.push(place);
      }
    });
    clusterer.visitedClusters = createClusters(clusterer, visited);
    clusterer.notVisitedClusters = createClusters(clusterer, notVisited);

    addClustersToMap(clusterer);
  }

  function removeClustersFromMap(clusterer) {
    if (clusterer.visitedClusters.length) {
      clusterer.visitedClusters.forEach(function(cluster) {
        MapService.removeClusterFromMap(cluster);
      });
    }
    if (clusterer.notVisitedClusters.length) {
      clusterer.notVisitedClusters.forEach(function(cluster) {
        MapService.removeClusterFromMap(cluster);
      });
    }
  }

  function addClustersToMap(clusterer) {
    var ne = clusterer.map.getBounds().getNorthEast();
    var sw = clusterer.map.getBounds().getSouthWest();
    var mapBounds = {
      minLat: sw.lat(),
      maxLat: ne.lat(),
      minLng: sw.lng(),
      maxLng: ne.lng()
    }

    clusterer.visitedClusters.forEach(function(cluster) {
      if (cluster.lat >= mapBounds.minLat && cluster.lat <= mapBounds.maxLat && cluster.lng >= mapBounds.minLng && cluster.lng <= mapBounds.maxLng) {
        MapService.addClusterToMap(clusterer.map, cluster, clusterer.clickHandler);
      }
    });
    clusterer.notVisitedClusters.forEach(function(cluster) {
      if (cluster.lat >= mapBounds.minLat && cluster.lat <= mapBounds.maxLat && cluster.lng >= mapBounds.minLng && cluster.lng <= mapBounds.maxLng) {
        MapService.addClusterToMap(clusterer.map, cluster, clusterer.clickHandler);
      }
    });
  }

  function createClusters(clusterer, places) {
    var clusters = [];
    var pigeon = [];
    places.forEach(function(place) {
      // find all places within tolerance
      var nearby = getClusterablePlaces(clusterer, place, places, pigeon);
      if (nearby && nearby.length) {
        var averageLatLng = calculateAverageLatLng(nearby);
        var cluster = {
          highlighted: false,
          lat: averageLatLng.lat,
          lng: averageLatLng.lng,
          isChecked: nearby[0].isChecked,
          places: nearby
        }
        clusters.push(cluster);
      }
    });
    return clusters;
  }

  function calculateAverageLatLng(places) {
    var totalLat = 0;
    var totalLng = 0;
    places.forEach(function(place) {
      var latlng = Shape.getCenterOfShape(place.shapeData);
      totalLat += latlng.lat;
      totalLng += latlng.lng;
    });
    return {
      lat: totalLat / places.length,
      lng: totalLng / places.length
    }
  }

  function getClusterablePlaces(clusterer, place, places, pigeon) {
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
