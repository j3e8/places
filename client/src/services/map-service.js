app.service("MapService", ["$rootScope", function($rootScope) {
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
        var icon = {
          url: place.highlighted
            ? '/assets/images/marker-highlighted.png'
            : (place.isChecked ? '/assets/images/marker-been-there.png' : '/assets/images/marker.png'),
          size: new google.maps.Size(44, 60),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(11, 29),
          scaledSize: new google.maps.Size(22, 30)
        }
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
      default: break;
    }
    if (gmObject) {
      place.gmObject = gmObject;
      if (clickHandler) {
        google.maps.event.addListener(place.gmObject, "click", clickHandler);
      }
    }
  }

  MapService.removePlaceFromMap = function(map, place) {
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

  MapService.updatePlaceOnMap = function(map, place) {
    if (!place || !place.gmObject) {
      return;
    }
    switch(place.shapeType) {
      case 'point':
        var icon = {
          url: place.highlighted
            ? '/assets/images/marker-highlighted.png'
            : (place.isChecked ? '/assets/images/marker-been-there.png' : '/assets/images/marker.png'),
          size: new google.maps.Size(44, 60),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(11, 29),
          scaledSize: new google.maps.Size(22, 30)
        }
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
      default: break;
    }
  }

  return MapService;
}]);
