app.controller("userListController", ["$scope", "$routeParams", "MapService", "ClusterService", "PlaceService", "ListService", "UserService", "alert", "$timeout", "$location", "requirePassword", "HOST", function($scope, $routeParams, MapService, ClusterService, PlaceService, ListService, UserService, alert, $timeout, $location, requirePassword, HOST) {
  var map, clusterer;
  var DEFAULT_COORDS = { lat: 39.5464, lng: -97.3296 };

  $scope.placeDialogIsDisplayed = undefined;
  $scope.centerCoords = DEFAULT_COORDS;
  $scope.signedInUser = UserService.getUser();

  UserService.getUserById($routeParams.userId)
  .then(function(u) {
    $scope.user = u;
    $scope.$apply();
  })
  .catch(function(e) { });

  if ($routeParams.userId == $scope.signedInUser.id) {
    ListService.markListAsRecentlyViewed($routeParams.listId)
    .catch(function(err) { });
  }

  MapService.load()
  .then(function() {
    initMap();
    clusterer = ClusterService.createClusterer(map, $scope.placeClicked);
    ListService.getListForUser($routeParams.listId, $routeParams.userId)
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

  $scope.followList = function() {
    if (!$scope.user || !$scope.user.id) {
      return;
    }
    requirePassword({
      afterAuthenticate: function() {
        ListService.follow($scope.signedInUser.id, $scope.list.id)
        .then(function() {
          $location.path('/list/' + $scope.list.id);
          $scope.$apply();
        })
        .catch(function(err) {
          console.error(err);
          $scope.$apply();
        });
      }
    });
  }

  $scope.toggleShareableLink = function() {
    $scope.shareableLinkIsDisplayed = $scope.shareableLinkIsDisplayed ? false : true;
    if ($scope.shareableLinkIsDisplayed) {
      $timeout(function() {
        try {
          var el = document.getElementById('shareable-link');
          el.select();
          document.execCommand('copy');
          alert("Copied link to clipboard");
        } catch(ex) {
          console.error(ex);
        }
      }, 10);
    }
  }

  $scope.getShareableLink = function() {
    if (!$scope.list || !$scope.user) {
      return '';
    }
    return HOST + '/list/' + $scope.list.id + "/user/" + $scope.user.id;
  }

  $scope.handleCheckboxClick = function(place) {
    console.log('handleCheckboxClick');
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
          var action = p.dateChecked ? 'Saved' : 'Removed';
          var reminder = $scope.list.isFollowed ? '' : 'Be sure to follow this list if you want to track your progress.';
          alert(action + " your visit to " + place.placeName + ". " + reminder);
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
