app.controller("listController", ["$scope", "$routeParams", "MapService", "PlaceService", "ListService", "UserService", "alert", "$timeout", "$location", function($scope, $routeParams, MapService, PlaceService, ListService, UserService, alert, $timeout, $location) {
  var map;
  var DEFAULT_COORDS = { lat: 39.5464, lng: -97.3296 };

  $scope.user = UserService.getUser();
  $scope.placeDialogIsDisplayed = undefined;
  $scope.centerCoords = DEFAULT_COORDS;

  MapService.load()
  .then(function() {
    initMap();
    ListService.get($routeParams.listId)
    .then(function(list) {
      $scope.list = list;
      ListService.sortList($scope.list, ListService.ALPHABETICALLY)
      $scope.list.places.forEach(function(place) {
        MapService.addPlaceToMap(map, place, $scope.placeClicked);
      });
      if (ListService.listHasPolylines($scope.list)) {
        MapService.toggleRoads(map, false);
      }
      var listBounds = ListService.calculateBounds($scope.list);
      MapService.setMapToContainList(map, listBounds);
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
    $scope.placeToEditId = place.id;
    $scope.placeDialogIsDisplayed = true;
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

  $scope.handleFollowChange = function() {
    if (!$scope.user || !$scope.user.id) {
      return;
    }
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

  $scope.handleCheckboxClick = function(place) {
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
