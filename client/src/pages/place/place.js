app.controller("placeController", ["$scope", "$routeParams", "MapService", "PlaceService", "ListService", "UserService", "alert", "$timeout", "$location",
function($scope, $routeParams, MapService, PlaceService, ListService, UserService, alert, $timeout, $location) {
  var map;

  $scope.user = UserService.getUser();
  $scope.placeDialogIsDisplayed = undefined;

  MapService.load()
  .then(function() {
    initMap();
    PlaceService.get($routeParams.placeId)
    .then(function(place) {
      $scope.place = place;
      MapService.addPlaceToMap(map, $scope.place, $scope.placeClicked);
      if ($scope.place.shapeType == 'polyline') {
        MapService.toggleRoads(map, false);
      }
      var bounds = PlaceService.calculateBounds($scope.place);
      MapService.setMapToContainList(map, bounds);
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load place", err);
      $scope.$apply();
    });
  })
  .catch(function(err) {
    console.error(err);
  });

  $scope.displayPlaceDialog = function(place) {
    $scope.placeToEdit = place;
    $scope.placeDialogIsDisplayed = true;
  }

  $scope.closePlaceDialog = function() {
    $scope.placeToEdit = null;
    $scope.placeDialogIsDisplayed = false;
  }

  $scope.afterPlaceSave = function() {
    $scope.place = $scope.placeToEdit;
    $scope.placeToEdit = null;
  }

  $scope.placeClicked = function(gmEvent) {
    var gmObject = this;
    $scope.place.highlighted = true;
    MapService.updatePlaceOnMap(map, $scope.place);
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
      zoom: $scope.zoom,
      center: new google.maps.LatLng($scope.centerCoords),
      mapTypeId: 'roadmap',
      gestureHandling: 'greedy'
    });
    map.setOptions({ styles: CUSTOM_MAP_STYLES });
    google.maps.event.addListener(map, "click", mapClick);
  }

  function mapClick() {
    $scope.place.isChecked = false;
    $scope.$apply();
  }

}]);
