app.controller("placesController", ["$scope", "PlaceService", "alert", function($scope, PlaceService, alert) {
  $scope.newPlaceDialogIsDisplayed = undefined;
  $scope.isDeterminingLocation = true;

  $scope.isLoading = false;

  $scope.nearbyPlaces = [];
  $scope.popularPlaces = [];

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handlePosition, handleError);
  }

  function handlePosition(position) {
    $scope.isDeterminingLocation = false;
    $scope.loadNearbyPlaces({ lat: position.coords.latitude, lng: position.coords.longitude });
    $scope.$apply();
  }

  function handleError(error) {
    alert("There was a problem getting your location.");
    $scope.loadPopularPlaces();
  }

  $scope.loadPopularPlaces = function() {
    $scope.isLoading = true;
    PlaceService.getPopularPlaces()
    .then(function(popularPlaces) {
      $scope.popularPlaces = popularPlaces;
      $scope.isLoading = false;
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load popular places", err);
      $scope.isLoading = false;
      $scope.$apply();
    });
  }

  $scope.loadNearbyPlaces = function(coords) {
    $scope.isLoading = true;
    PlaceService.searchPlacesByLocation(coords)
    .then(function(nearbyPlaces) {
      $scope.nearbyPlaces = nearbyPlaces;
      $scope.isLoading = false;
      if (!nearbyPlaces || !nearbyPlaces.length) {
        $scope.loadPopularPlaces();
      }
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load nearby places", err);
      $scope.isLoading = false;
      $scope.$apply();
    });
  }

  $scope.editPlace = function(place) {
    $scope.placeToEditId = place.id;
    $scope.newPlaceDialogIsDisplayed = true;
  }

  $scope.afterPlaceSave = function(place) {
    var existing = $scope.list.places.find(function(p) { return p.id == place.id; });
    if (existing) {
      $scope.list.places.splice($scope.list.places.indexOf(existing), 1, place);
    }
    $scope.closeNewPlaceDialog();
  }

  $scope.closeNewPlaceDialog = function() {
    $scope.placeToEditId = null;
    $scope.newPlaceDialogIsDisplayed = false;
  }

}]);
