app.controller("editListController", ["$scope", "$routeParams", "MapService", "PlaceService", "ListService", "alert", "$timeout", "$location",
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
        console.log('here');
        $scope.list = list;
        $scope.list.places.forEach(function(place) {
          console.log('.');
          MapService.addPlaceToMap(map, place, $scope.placeClicked);
        });
        var listBounds = ListService.calculateBounds($scope.list);
        MapService.setMapToContainList(map, listBounds);
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

  $scope.placeClicked = function(e) {
    console.log('placeClicked', e);
    // find which place was clicked
    // update the marker for the currently highlighted place (remove highlight from previous)
    // highlight the correct place on the list
    // scroll to the place on the list
  }

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
    MapService.addPlaceToMap(map, place, $scope.placeClicked);
    var listBounds = ListService.calculateBounds($scope.list);
    MapService.setMapToContainList(map, listBounds);
  }

  $scope.removePlace = function(place) {
    $scope.list.places.splice($scope.list.places.indexOf(place), 1);
    MapService.removePlaceFromMap(map, place);
    var listBounds = ListService.calculateBounds($scope.list);
    MapService.setMapToContainList(map, listBounds);
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
        $location.path('/list/' + list.id + '/edit');
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
  }

}]);
