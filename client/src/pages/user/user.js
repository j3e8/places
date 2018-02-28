app.controller("userController", ["$scope", "$routeParams", "MapService", "PlaceService", "ListService", "UserService", "Shape", "alert", "$timeout", "$location",
function($scope, $routeParams, MapService, PlaceService, ListService, UserService, Shape, alert, $timeout, $location) {
  var map;

  $scope.currentUser = UserService.getUser();
  $scope.placeDialogIsDisplayed = undefined;
  $scope.placeCenter = null;

  $scope.followedLists = null;
  $scope.createdLists = null;
  $scope.places = null;

  MapService.load()
  .then(function() {
    initMap();
    getRecentPlacesForUser();
    getListsFollowedByUser();
    getListsCreatedByUser();
  })
  .catch(function(err) {
    console.error(err);
  });

  $scope.isLoadingUser = true;
  UserService.getUserById($routeParams.userId)
  .then(function(user) {
    $scope.user = user;
    $scope.isLoadingUser = false;
    $scope.$apply();
  })
  .catch(function(err) {
    console.error(err);
    $scope.isLoadingUser = false;
    $scope.$apply();
  });

  $scope.displayPlaceDialog = function() {
    $scope.placeDialogIsDisplayed = true;
  }

  $scope.closePlaceDialog = function() {
    $scope.placeDialogIsDisplayed = false;
  }

  $scope.afterPlaceSave = function() {
  }

  $scope.handleFollowChange = function() {
    if ($scope.user.isFollowed) {
      UserService.unfollow($scope.currentUser.id, $routeParams.userId)
      .then(function() {
        $scope.user.isFollowed = false;
        $scope.user.numberOfFollowers--;
        $scope.$apply();
      })
      .catch(function(err) {
        $scope.$apply();
      });
    }
    else {
      UserService.follow($scope.currentUser.id, $routeParams.userId)
      .then(function() {
        $scope.user.isFollowed = true;
        $scope.user.numberOfFollowers++;
        $scope.$apply();
      })
      .catch(function(err) {
        $scope.$apply();
      });
    }
  }

  function getRecentPlacesForUser() {
    PlaceService.getRecentPlacesForUser($routeParams.userId)
    .then(function(places) {
      $scope.places = places;
      $scope.places.forEach(function(place) {
        MapService.addPlaceToMap(map, place, $scope.placeClicked);
      });
      var fauxList = { places: $scope.places };
      var bounds = ListService.calculateBounds(fauxList);
      MapService.setMapToContainList(map, bounds);
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load places for user", err);
      $scope.$apply();
    });
  }

  function getListsFollowedByUser() {
    ListService.getListsFollowedByUser($routeParams.userId)
    .then(function(lists) {
      $scope.followedLists = lists;
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load lists for user", err);
    });
  }

  function getListsCreatedByUser() {
    ListService.getListsCreatedByUser($routeParams.userId)
    .then(function(lists) {
      $scope.createdLists = lists;
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load lists for user", err);
    });
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
