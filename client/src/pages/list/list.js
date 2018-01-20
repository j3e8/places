app.controller("listController", ["$scope", "MapService", "PlaceService", "$timeout", function($scope, MapService, PlaceService, $timeout) {
  $scope.places = [];
  $scope.newPlaceDialogIsDisplayed = undefined;

  var map;
  var drawingManager;

  $scope.centerCoords = null;
  var DEFAULT_COORDS = { lat: 39.5464, lng: -97.3296 };
  var DEFAULT_ZOOM = 4;
  var SPECIFIC_ZOOM = 7;
  var shapeList = [];

  MapService.load()
  .then(function() {
    initMap();
  })
  .catch(function(err) {
    console.error(err);
  });

  var searchTimeout = null;
  $scope.searchPlaces = function(str) {
    $timeout.cancel(searchTimeout);
    $timeout(function() {
      PlaceService.search(str)
      .then(function(places) {
        $scope.placeSearchResults = places;
        $scope.$apply();
      })
      .catch(function(err) {
        console.error(err);
        $scope.$apply();
      });
    }, 200);
  }

  $scope.showNewPlaceDialog = function() {
    var latlng = map.getCenter();
    $scope.centerCoords = { lat: latlng.lat(), lng: latlng.lng() };
    $scope.newPlaceDialogIsDisplayed = true;
  }

  $scope.afterPlaceSave = function(place) {
    $scope.closeNewPlaceDialog();
    $scope.addPlaceToList(place);
  }

  $scope.handlePlaceResultClick = function(place) {
    $scope.addPlaceToList(place);
    $scope.placeSearch = '';
  }

  $scope.addPlaceToList = function(place) {
    $scope.places.push(place);
    addPlaceToMap(place);
    // TODO: reset bounds of map to contain all places
  }

  $scope.closeNewPlaceDialog = function() {
    $scope.newPlaceDialogIsDisplayed = false;
  }

  function initMap() {
    var coords = $scope.centerCoords || DEFAULT_COORDS;
    var zoom = $scope.centerCoords ? SPECIFIC_ZOOM : DEFAULT_ZOOM;
    map = new google.maps.Map(document.getElementById('list-map'), {
      zoom: zoom,
      center: new google.maps.LatLng(coords),
      mapTypeId: 'roadmap',
      gestureHandling: 'greedy'
    });

    // initializeShapeList();
  }

  /*
  function addShapeToList(shape) {
    loadShapeList();
    shapeList.push(shape);
    var savableShapeList = shapeList.map(function(sh) {
      let obj = Object.assign({}, sh);
      delete obj.gmObject;
      return obj;
    });
    localStorage.setItem('shapeList', JSON.stringify(savableShapeList));
  }

  function loadShapeList() {
    var list = localStorage.getItem('shapeList');
    if (list) {
      list = JSON.parse(list);
    }
    else {
      list = [];
    }
    shapeList = list;
  }

  function initializeShapeList() {
    if (!map) {
      console.error("Can't initializeShapeList without map");
      return;
    }
    loadShapeList();
    shapeList.forEach(function(shape) {
      var gmPolygon = new google.maps.Polygon({
        shapeId: shape.id,
        paths: shape.coords,
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ff0000',
        fillOpacity: 0.35
      });
      gmPolygon.setMap(map);
      google.maps.event.addListener(gmPolygon, "click", shapeClick);
      shape.gmObject = gmPolygon;
    });
  }
  */

  function addPlaceToMap(place) {
    var gmObject;
    console.log('addPlaceToMap', place);
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

}]);
