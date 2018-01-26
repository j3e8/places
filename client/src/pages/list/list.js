app.controller("listController", ["$scope", "$routeParams", "MapService", "PlaceService", "ListService", "alert", "$timeout", "$location",
function($scope, $routeParams, MapService, PlaceService, ListService, alert, $timeout, $location) {
  $scope.newPlaceDialogIsDisplayed = undefined;
  $scope.list = {
    places: []
  };

  var map;
  var drawingManager;

  var DEFAULT_COORDS = { lat: 39.5464, lng: -97.3296 };
  var DEFAULT_ZOOM = 4;
  var SPECIFIC_ZOOM = 7;
  var shapeList = [];

  $scope.centerCoords = DEFAULT_COORDS;
  $scope.zoom = DEFAULT_ZOOM;

  MapService.load()
  .then(function() {
    initMap();
    if ($routeParams.listId) {
      ListService.get($routeParams.listId)
      .then(function(list) {
        $scope.list = list;
        $scope.list.places.forEach(function(place) {
          addPlaceToMap(place);
        });
        setMapToContainPlaces();
        $scope.$apply();
      })
      .catch(function(err) {
        console.error("Couldn't load list", err);
        $scope.$apply();
      });
    }
  })
  .catch(function(err) {
    console.error(err);
  });

  var searchTimeout = null;
  $scope.searchPlaces = function(str) {
    $timeout.cancel(searchTimeout);
    searchTimeout = $timeout(function() {
      PlaceService.search(str)
      .then(function(places) {
        $scope.placeSearchResults = places;
        $scope.$apply();
      })
      .catch(function(err) {
        $scope.$apply();
      });
    }, 300);
  }

  $scope.showNewPlaceDialog = function() {
    var latlng = map.getCenter();
    $scope.centerCoords = { lat: latlng.lat(), lng: latlng.lng() };
    $scope.zoom = map.getZoom();
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
    $scope.list.places.push(place);
    addPlaceToMap(place);
    setMapToContainPlaces();
  }

  $scope.closeNewPlaceDialog = function() {
    $scope.newPlaceDialogIsDisplayed = false;
  }

  $scope.saveList = function() {
    $scope.saveError = null;
    if (!$scope.list.listName) {
      $scope.saveError = "You must provide a list name";
      return;
    }
    if (!$scope.list.places.length) {
      $scope.saveError = "You must add at least one place before saving";
      return;
    }
    $scope.isSaving = true;
    createOrUpdate()
    .then(function(list) {
      $scope.isSaving = false;
      if (list.id && !$scope.list.id) {
        $location.path('/list/' + list.id);
      }
      else {
        $scope.list = list;
      }
      $scope.$apply();
    })
    .catch(function(error) {
      $scope.isSaving = false;
      alert("There was a problem saving your list. Try again later.", true);
      console.error(error);
      $scope.$apply();
    });
  }

  $scope.cancelList = function() {
    $location.path('/home');
  }

  function createOrUpdate() {
    var list = Object.assign({}, $scope.list);
    list.places = list.places.map(function(place) {
      return { id: place.id };
    });
    if ($scope.list.id) {
      return ListService.update(list.id, list);
    }
    else {
      console.log('create', list);
      return ListService.create(list);
    }
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('list-map'), {
      zoom: $scope.zoom,
      center: new google.maps.LatLng($scope.centerCoords),
      mapTypeId: 'roadmap',
      gestureHandling: 'greedy'
    });
    map.setOptions({ styles: CUSTOM_MAP_STYLES });

    // initializeShapeList();
  }

  /*
  function addShapeToList(shape) {
    loadShapeList();
    shapeList.push(shape);
    var savableShapeList = shapeList.map(function(sh) {
      var obj = Object.assign({}, sh);
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

  function setMapToContainPlaces() {
    var listBounds = ListService.calculateBounds($scope.list);
    // var avgLat = (bounds.minLat + bounds.maxLat) / 2;
    // var avgLng = (bounds.minLng + bounds.maxLng) / 2;
    // map.setCenter(new google.maps.LatLng({ lat: avgLat, lng: avgLng }));

    var bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: listBounds.minLat, lng: listBounds.minLng });
    bounds.extend({ lat: listBounds.maxLat, lng: listBounds.maxLng });
    map.fitBounds(bounds);
  }

}]);
