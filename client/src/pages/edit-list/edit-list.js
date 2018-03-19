app.controller("editListController", ["$scope", "$routeParams", "MapService", "ClusterService", "PlaceService", "ListService", "alert", "$timeout", "$location", "requirePassword",
function($scope, $routeParams, MapService, ClusterService, PlaceService, ListService, alert, $timeout, $location, requirePassword) {
  $scope.newPlaceDialogIsDisplayed = undefined;
  $scope.list = {
    places: []
  };

  var map, clusterer;

  var DEFAULT_COORDS = { lat: 39.5464, lng: -97.3296 };
  var DEFAULT_ZOOM = 4;
  var SPECIFIC_ZOOM = 7;
  var shapeList = [];

  $scope.centerCoords = DEFAULT_COORDS;

  MapService.load()
  .then(function() {
    initMap();
    clusterer = ClusterService.createClusterer(map, $scope.placeClicked);
    if ($routeParams.listId) {
      loadList($routeParams.listId);
    }
  })
  .catch(function(err) {
    console.error(err);
  });

  function loadList(listId) {
    ListService.get(listId)
    .then(function(list) {
      $scope.list = list;
      var listBounds = ListService.calculateBounds($scope.list);
      MapService.setMapToContainList(map, listBounds);
      $scope.list.places.forEach(function(place) {
        ClusterService.addPlaceToClusterer(clusterer, place);
      });
      $timeout(function() {
        ClusterService.update(clusterer);
      });
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load list", err);
      $scope.$apply();
    });
  }

  $scope.placeClicked = function(gmEvent) {
    var gmObject = this;
    $scope.unhighlightAllPlaces();

    var clickedPlace = $scope.list.places.find(function(place) {
      return place.id == gmObject.shapeId;
    });

    if (clickedPlace) {
      clickedPlace.highlighted = true;
      MapService.updatePlaceOnMap(map, clickedPlace);

      // scroll to the place on the list
      var li = document.getElementById('place_' + clickedPlace.id);
      if (li) {
        var placeList = document.getElementById('place-list');
        placeList.scrollTo(0, li.offsetTop);
      }
    }
    $scope.$apply();
  }

  $scope.unhighlightAllPlaces = function() {
    $scope.list.places.forEach(function(place) {
      place.highlighted = false;
      MapService.updatePlaceOnMap(map, place);
    });
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
    console.log('showNewPlaceDialog');
    requirePassword({
      afterAuthenticate: function() {
        console.log('afterAuthenticate');
        var latlng = map.getCenter();
        $scope.centerCoords = { lat: latlng.lat(), lng: latlng.lng() };
        $scope.zoom = map.getZoom();
        $scope.placeToEditId = null;
        $scope.newPlaceDialogIsDisplayed = true;
      }
    });
  }

  $scope.editPlace = function(place) {
    $scope.placeToEditId = place.id;
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
    var existing = $scope.list.places.find(function(p) { return p.id == place.id; });
    if (existing) {
      // existing.gmObject.setMap(null);
      $scope.list.places.splice($scope.list.places.indexOf(existing), 1, place);
    }
    else {
      $scope.list.places.push(place);
    }
    ClusterService.addPlaceToClusterer(clusterer, place);
    ClusterService.update(clusterer);
  }

  $scope.removePlace = function(place) {
    $scope.list.places.splice($scope.list.places.indexOf(place), 1);
    ClusterService.removePlaceFromClusterer(clusterer, place);
    ClusterService.update(clusterer);
  }

  $scope.closeNewPlaceDialog = function() {
    $scope.placeToEditId = null;
    $scope.newPlaceDialogIsDisplayed = false;
  }

  $scope.saveList = function() {
    requirePassword({
      afterAuthenticate: function() {
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
      return ListService.create(list);
    }
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('list-map'), {
      zoom: DEFAULT_ZOOM,
      center: new google.maps.LatLng($scope.centerCoords),
      mapTypeId: 'roadmap',
      gestureHandling: 'greedy'
    });
    map.setOptions({ styles: CUSTOM_MAP_STYLES });
    google.maps.event.addListener(map, "click", mapClick);
  }

  function mapClick() {
    $scope.unhighlightAllPlaces();
    $scope.$apply();
  }

}]);
