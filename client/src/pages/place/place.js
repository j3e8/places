app.controller("placeController", ["$scope", "$routeParams", "MapService", "PlaceService", "ListService", "UserService", "Shape", "alert", "$timeout", "$location",
function($scope, $routeParams, MapService, PlaceService, ListService, UserService, Shape, alert, $timeout, $location) {
  var map;
  var DEFAULT_ZOOM = 15;

  $scope.user = UserService.getUser();
  $scope.placeDialogIsDisplayed = undefined;
  $scope.placeCenter = null;

  MapService.load()
  .then(function() {
    initMap();
    getPlace();
    getListsForPlace();
  })
  .catch(function(err) {
    console.error(err);
  });

  $scope.displayPlaceDialog = function() {
    $scope.placeDialogIsDisplayed = true;
  }

  $scope.closePlaceDialog = function() {
    $scope.placeDialogIsDisplayed = false;
  }

  $scope.afterPlaceSave = function() {
  }

  function getPlace() {
    PlaceService.getPlace($routeParams.placeId)
    .then(function(place) {
      $scope.place = place;
      $scope.placeCenter = Shape.getCenterOfShape($scope.place.shapeData);
      MapService.addPlaceToMap(map, $scope.place, $scope.placeClicked);
      if ($scope.place.shapeType == 'polyline') {
        MapService.toggleRoads(map, false);
      }
      var bounds = PlaceService.calculateBounds($scope.place);
      // MapService.setMapToContainList(map, bounds);
      map.setZoom(DEFAULT_ZOOM);
      map.setCenter(new google.maps.LatLng($scope.placeCenter));
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load place", err);
      $scope.$apply();
    });
  }

  function getListsForPlace() {
    ListService.getListsForPlace($routeParams.placeId)
    .then(function(lists) {
      $scope.lists = lists;
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load lists for place", err);
    });
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('list-map'), {
      mapTypeId: 'roadmap',
      gestureHandling: 'greedy'
    });
    map.setOptions({ styles: CUSTOM_MAP_STYLES });
  }

}]);
