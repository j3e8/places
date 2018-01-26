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

  MapService.addPlaceToMap = function(map, place) {
    var gmObject;
    switch(place.shapeType) {
      case 'point':
        gmObject = new google.maps.Marker({
          shapeId: place.id,
          position: new google.maps.LatLng(place.shapeData.lat, place.shapeData.lng),
          title: place.placeName,
          map: map
        });
        break;
      case 'polygon':
        gmObject = new google.maps.Polygon({
          shapeId: place.id,
          paths: place.shapeData,
          strokeColor: '#ff0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#ff0000',
          fillOpacity: 0.35,
          map: map
        });
        break;
      default:
        break;
    }
    if (gmObject) {
      // google.maps.event.addListener(gmObject, "click", shapeClick);
      place.gmObject = gmObject;
    }
  }

  MapService.setMapToContainList = function(map, listBounds) {
    var bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: listBounds.minLat, lng: listBounds.minLng });
    bounds.extend({ lat: listBounds.maxLat, lng: listBounds.maxLng });
    map.fitBounds(bounds);
  }


  return MapService;
}]);
