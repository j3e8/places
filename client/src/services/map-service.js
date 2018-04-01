app.service("MapService", ["$rootScope", "Shape", function($rootScope, Shape) {
  var MapService = {
    loaded: false
  };
  var subscribers = [];

  if (window.MAP_IS_LOADED) {
    handleMapLoaded();
  }

  $rootScope.$on("gm-map-loaded", function($event, data) {
    handleMapLoaded();
  });

  function handleMapLoaded() {
    MapService.loaded = true;
    var subs = subscribers.splice(0, subscribers.length);
    subs.forEach(function(s) {
      s();
    });
  }

  MapService.load = function() {
    if (MapService.loaded) {
      return Promise.resolve();
    }
    return new Promise(function(resolve, reject) {
      subscribers.push(resolve);
    });
  }

  MapService.addPlaceToMap = function(map, place, clickHandler) {
    var gmObject;
    switch(place.shapeType) {
      case 'point':
        var icon = buildIconForPlace(map, place);
        gmObject = new google.maps.Marker({
          shapeId: place.id,
          position: new google.maps.LatLng(place.shapeData.lat, place.shapeData.lng),
          title: place.placeName,
          icon: icon,
          map: map
        });
        break;
      case 'polygon':
        gmObject = new google.maps.Polygon({
          shapeId: place.id,
          paths: place.shapeData,
          strokeColor: place.isChecked ? '#2fb0dd' : '#c67788',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: place.isChecked ? '#45c5ff' : '#ef8f9f',
          fillOpacity: 0.4,
          map: map
        });
        break;
      case 'polyline':
        gmObject = new google.maps.Polyline({
          shapeId: place.id,
          path: place.shapeData,
          strokeColor: place.isChecked ? '#2fb0dd' : '#c67788',
          strokeOpacity: 0.9,
          strokeWeight: 4,
          map: map
        });
        break;
      default: break;
    }
    if (gmObject) {
      place.gmObject = gmObject;
      if (clickHandler) {
        google.maps.event.addListener(place.gmObject, "click", clickHandler);
      }
    }
  }

  MapService.addClusterToMap = function(map, cluster, clickHandler) {
    if (!cluster || !cluster.places || !cluster.places.length) {
      return;
    }
    if (cluster.places.length == 1) {
      return MapService.addPlaceToMap(map, cluster.places[0], clickHandler);
    }
    var icon = buildIconForCluster(map, cluster);
    cluster.gmObject = new google.maps.Marker({
      position: new google.maps.LatLng((cluster.minLat + cluster.maxLat)/2, (cluster.minLng + cluster.maxLng)/2),
      icon: icon,
      label: {
        text: cluster.places.length.toString(),
        color: "#fff",
        fontFamily: "Open Sans",
        fontSize: "16px",
        fontWeight: "500"
      },
      map: map
    });
  }

  MapService.findContainingRegion = function(shapeData) {
    return new Promise(function(resolve, reject) {
      var geocoder = new google.maps.Geocoder();
      var shapeBounds = Shape.calculateBounds(shapeData);
      var center = Shape.getCenterOfShape(shapeData);
      var coord = new google.maps.LatLng(center.lat, center.lng);
      geocoder.geocode({'latLng': coord}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK && results && results.length) {
          var regions = results.filter(function(r) {
            if (!r.geometry.bounds) {
              return false;
            }
            var ne = r.geometry.bounds.getNorthEast();
            var sw = r.geometry.bounds.getSouthWest();
            var regionBounds = {
              minLat: sw.lat(),
              maxLat: ne.lat(),
              maxLng: ne.lng(),
              minLng: sw.lng()
            }
            if (Shape.boundsContains(regionBounds, shapeBounds)) {
              return true;
            }
            return false;
          });
          return resolve(formatRegion(regions));
        }
        resolve();
      });
    });
  }

  MapService.zoomToPlace = function(map, place) {
    var shapeBounds = Shape.calculateBounds(place.shapeData);
    var center = Shape.getCenterOfShape(place.shapeData);
    var zoom = 6;
    if (shapeBounds.minLat == shapeBounds.maxLat || shapeBounds.minLng == shapeBounds.maxLng) {
      zoom = 12;
    }
    map.setZoom(zoom);
    map.setCenter(new google.maps.LatLng(center));
  }

  function formatRegion(regions) {
    if (!regions || !regions.length) {
      return '';
    }

    var r = regions[0];
    var first = r.address_components.find(function(a) { return a.types.indexOf('locality') > -1; });
    var second = r.address_components.find(function(a) { return a.types.indexOf('administrative_area_level_1') > -1; });
    var third = r.address_components.find(function(a) { return a.types.indexOf('country') > -1; });

    var parts = [];
    if (first) {
      parts.push(first.short_name || first.long_name);
    }
    if (second) {
      parts.push(second.short_name || second.long_name);
    }
    if (third) {
      parts.push(third.short_name || third.long_name);
    }
    return parts.join(', ');
  }

  MapService.removeClusterFromMap = function(cluster) {
    if (cluster && cluster.places && cluster.places.length == 1) {
      MapService.removePlaceFromMap(cluster.places[0]);
    }
    if (cluster && cluster.gmObject) {
      cluster.gmObject.setMap(null);
      cluster.gmObject = undefined;
    }
  }

  MapService.removePlaceFromMap = function(place) {
    if (place && place.gmObject) {
      place.gmObject.setMap(null);
    }
    place.gmObject = undefined;
  }

  MapService.setMapToContainList = function(map, listBounds) {
    if (!listBounds || !listBounds.minLat || !listBounds.maxLat || !listBounds.minLng || !listBounds.maxLng) {
      return;
    }
    var bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: listBounds.minLat, lng: listBounds.minLng });
    bounds.extend({ lat: listBounds.maxLat, lng: listBounds.maxLng });
    map.fitBounds(bounds);
  }

  MapService.toggleRoads = function(map, on) {
    var styleArray = [
      {
        featureType: "road",
        stylers: [
          { visibility: (on ? "on" : "off") }
        ]
      }
    ];
    map.setOptions({styles: styleArray});
  }

  MapService.updatePlaceOnMap = function(map, place) {
    if (!place || !place.gmObject) {
      return;
    }
    switch(place.shapeType) {
      case 'point':
        var icon = buildIconForPlace(map, place);
        place.gmObject.setIcon(icon);
        break;
      case 'polygon':
        place.gmObject.setOptions({
          strokeColor: place.highlighted
            ? '#ddc937'
            : (place.isChecked ? '#2fb0dd' : '#c67788'),
          fillColor: place.highlighted
            ? '#ffed48'
            : (place.isChecked ? '#45c5ff' : '#ef8f9f')
        });
        break;
      case 'polyline':
        place.gmObject.setOptions({
          strokeColor: place.highlighted
            ? '#ddc937'
            : (place.isChecked ? '#2fb0dd' : '#c67788')
        });
        break;
      default: break;
    }
  }

  function buildIconForCluster(map, cluster) {
    var s = 32;
    var s2 = Math.round(s/2);
    var icon = {
      url: cluster.highlighted
        ? '/assets/images/marker2-highlighted.png'
        : (cluster.isChecked ? '/assets/images/marker2-been-there.png' : '/assets/images/marker2.png'),
      size: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      labelOrigin: new google.maps.Point(s2, s2),
      anchor: new google.maps.Point(s2, s2),
      scaledSize: new google.maps.Size(s, s)
    }
    return icon;
  }

  function buildIconForPlace(map, place) {
    var s = 32;
    var s2 = Math.round(s/2);
    var icon = {
      url: place.highlighted
        ? '/assets/images/marker2-highlighted.png'
        : (place.isChecked ? '/assets/images/marker2-been-there.png' : '/assets/images/marker2.png'),
      size: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(s2, s2),
      scaledSize: new google.maps.Size(s, s)
    }
    return icon;
  }

  return MapService;
}]);
