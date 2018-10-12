app.controller("userListController", function($scope, $routeParams, MapService, ClusterService, PlaceService, ListService, UserService, alert, $timeout, $location, requirePassword, HOST, ImageService) {
  var placeForLastPhotoUpload;

  $scope.activeDrawer = 1;

  $scope.placeDialogIsDisplayed = undefined;
  $scope.signedInUser = UserService.getUser();

  UserService.getUserById($routeParams.userId)
  .then(function(u) {
    $scope.user = u;
    $scope.$apply();
  })
  .catch(function(e) { });

  ListService.getListForUser($routeParams.listId, $routeParams.userId)
  .then(function(list) {
    $scope.list = list;
    ListService.sortList($scope.list, ListService.ALPHABETICALLY);
    $scope.$apply();
  })
  .catch(function(err) {
    console.error("Couldn't load list", err);
    $scope.$apply();
  });

  if ($scope.signedInUser && $routeParams.userId == $scope.signedInUser.id) {
    ListService.markListAsRecentlyViewed($routeParams.listId)
    .catch(function(err) { });
  }

  $scope.highlightPlace = function(place, zoomTo, scrollTo) {
    $scope.unhighlightAllPlaces();
    place.highlighted = true;
    $scope.$broadcast('highlight-place', { place: place, zoomTo: zoomTo, scrollTo: scrollTo });
  }

  $scope.placeChanged = function(place) {
    $scope.$broadcast('place-changed', place);
  }

  $scope.unhighlightAllPlaces = function() {
    $scope.list.places.forEach(function(place) {
      place.highlighted = false;
    });
  }

  $scope.setActiveDrawer = function(num) {
    if ($scope.activeDrawer == num) {
      $scope.activeDrawer = num - 1;
    }
    else {
      $scope.activeDrawer = num || 1;
    }
  }

});
