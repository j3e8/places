app.controller("listController", ["$scope", "$routeParams", "MapService", "ClusterService", "PlaceService", "ListService", "UserService", "alert", "$timeout", "$location", "requirePassword", function($scope, $routeParams, MapService, ClusterService, PlaceService, ListService, UserService, alert, $timeout, $location, requirePassword) {
  var map, clusterer;
  var DEFAULT_COORDS = { lat: 39.5464, lng: -97.3296 };

  $scope.user = UserService.getUser();
  $scope.placeDialogIsDisplayed = undefined;
  $scope.centerCoords = DEFAULT_COORDS;

  MapService.load()
  .then(function() {
    initMap();
    clusterer = ClusterService.createClusterer(map, $scope.placeClicked);
    ListService.get($routeParams.listId)
    .then(function(list) {
      $scope.list = list;
      ListService.sortList($scope.list, ListService.ALPHABETICALLY)
      if (ListService.listHasPolylines($scope.list)) {
        MapService.toggleRoads(map, false);
      }
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
  })
  .catch(function(err) {
    console.error(err);
  });

  $scope.displayPlaceDialog = function(place) {
    requirePassword({
      afterAuthenticate: function() {
        $scope.placeToEditId = place.id;
        $scope.placeDialogIsDisplayed = true;
      }
    });
  }

  $scope.closePlaceDialog = function() {
    $scope.placeToEditId = null;
    $scope.placeDialogIsDisplayed = false;
  }

  $scope.afterPlaceSave = function(place) {

  }

  $scope.placeClicked = function(gmEvent) {
    var gmObject = this;
    $scope.unhighlightAllPlaces();
    $scope.placeFilter = undefined;

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

  $scope.highlightPlace = function(place) {
    $scope.unhighlightAllPlaces();
    place.highlighted = true;
    MapService.updatePlaceOnMap(map, place);
    MapService.zoomToPlace(map, place);
  }

  $scope.unhighlightAllPlaces = function() {
    $scope.list.places.forEach(function(place) {
      place.highlighted = false;
      MapService.updatePlaceOnMap(map, place);
    });
  }

  $scope.handleFollowChange = function() {
    if (!$scope.user || !$scope.user.id) {
      return;
    }
    requirePassword({
      afterAuthenticate: function() {
        $scope.list.isFollowed = !$scope.list.isFollowed;
        if ($scope.list.isFollowed) {
          ListService.follow($scope.user.id, $scope.list.id)
          .then(function() {
            $scope.list.numberOfFollowers++;
            $scope.$apply();
          })
          .catch(function(err) {
            console.error(err);
            $scope.$apply();
          });
        }
        else {
          ListService.unfollow($scope.user.id, $scope.list.id)
          .then(function() {
            $scope.list.numberOfFollowers--;
            $scope.$apply();
          })
          .catch(function(err) {
            console.error(err);
            $scope.$apply();
          });
        }
      }
    });
  }

  $scope.handleCheckboxClick = function(place) {
    requirePassword({
      afterAuthenticate: function() {
        var p = Object.assign({}, place);
        p.gmObject = undefined;
        if (!p.isChecked) {
          p.dateChecked = undefined;
        }
        PlaceService.updateUserPlace($scope.user.id, p)
        .then(function(p) {
          place.dateChecked = p.dateChecked;
          MapService.updatePlaceOnMap(map, place);
          $scope.$apply();
        })
        .catch(function(err) {
          $scope.$apply();
        });
      }
    });
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('list-map'), {
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
