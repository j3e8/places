app.controller("placesController", ["$scope", "PlaceService", "MapService", "Shape", "alert", "$timeout", function($scope, PlaceService, MapService, Shape, alert, $timeout) {
  var map;

  $scope.newPlaceDialogIsDisplayed = undefined;
  $scope.isDeterminingLocation = true;

  $scope.isLoading = false;

  $scope.nearbyPlaces = [];
  $scope.popularPlaces = [];

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handlePosition, handleError);
  }

  MapService.load()
  .then(function() {
    initMap();
    $scope.$apply();
  })
  .catch(function(err) {
    console.error(err);
  });

  function handlePosition(position) {
    $scope.isDeterminingLocation = false;
    // map.setCenter(new google.maps.LatLng({ lat: position.coords.latitude, lng: position.coords.longitude }));
    // map.getBounds();
    var bounds = {
      minLat: position.coords.latitude - 1,
      maxLat: position.coords.latitude + 1,
      minLng: position.coords.longitude - 1,
      maxLng: position.coords.longitude + 1
    };
    $scope.loadNearbyPlaces(bounds);
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
      addPlacesToMap(popularPlaces);
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load popular places", err);
      $scope.isLoading = false;
      $scope.$apply();
    });
  }

  $scope.loadNearbyPlaces = function(bounds) {
    var center = Shape.getCenterOfBounds(bounds);
    $scope.isLoading = true;
    PlaceService.searchPlacesByLocation(bounds)
    .then(function(nearbyPlaces) {
      $scope.nearbyPlaces = nearbyPlaces;
      $scope.nearbyPlaces.forEach(function(place) {
        var placeCenter = Shape.getCenterOfShape(place.shapeData);
        place.distance = Shape.calculateDistanceBetweenCoordinates(center, placeCenter);
      });
      $scope.nearbyPlaces.sort(function(a, b) {
        if (a.distance == b.distance) return 0;
        return a.distance < b.distance ? -1 : 1;
      });
      $scope.isLoading = false;
      if (!nearbyPlaces || !nearbyPlaces.length) {
        $scope.loadPopularPlaces();
        return;
      }
      addPlacesToMap(nearbyPlaces);
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

  $scope.unhighlightAllPlaces = function() {
    var places = $scope.nearbyPlaces ? $scope.nearbyPlaces : $scope.popularPlaces;
    places.forEach(function(place) {
      place.highlighted = false;
      MapService.updatePlaceOnMap(map, place);
    });
  }

  $scope.placeClicked = function(gmEvent) {
    var gmObject = this;
    $scope.unhighlightAllPlaces();

    var places = $scope.nearbyPlaces ? $scope.nearbyPlaces : $scope.popularPlaces;
    var clickedPlace = places.find(function(place) {
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

  function addPlacesToMap(places) {
    if (!map) {
      console.log('map not ready');
      return $timeout(addPlacesToMap.bind(this, places), 10);
    }
    console.log('adding places');
    places.forEach(function(place) {
      MapService.addPlaceToMap(map, place, handlePlaceClick);
    });
    var fauxList = { places: places };
    var listBounds = ListService.calculateBounds(fauxList);
    MapService.setMapToContainList(map, listBounds);
  }

  function handlePlaceClick(place) {

  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('place-map'), {
      zoom: $scope.zoom,
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
