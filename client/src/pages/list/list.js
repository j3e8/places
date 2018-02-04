app.controller("listController", ["$scope", "$routeParams", "MapService", "PlaceService", "ListService", "UserService", "alert", "$timeout", "$location",
function($scope, $routeParams, MapService, PlaceService, ListService, UserService, alert, $timeout, $location) {
  var map;

  $scope.user = UserService.getUser();

  MapService.load()
  .then(function() {
    initMap();
    ListService.get($routeParams.listId)
    .then(function(list) {
      $scope.list = list;
      $scope.list.places.forEach(function(place) {
        MapService.addPlaceToMap(map, place, $scope.placeClicked);
      });
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

  $scope.placeClicked = function(gmObject) {
    console.log('placeClicked', gmObject);

    var lat = gmObject.latLng.lat();
    var lng = gmObject.latLng.lng();

    $scope.unhighlightAllPlaces();

    var clickedPlace = findPlaceByLatLng(lat, lng);
    if (clickedPlace) {
      clickedPlace.highlighted = true;
      MapService.updatePlaceOnMap(map, clickedPlace);
      
      // scroll to the place on the list
      var li = document.getElementById('place_' + clickedPlace.id);
      if (li) {
        console.log(li.offsetTop);
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

  function findPlaceByLatLng(lat, lng) {
    return $scope.list.places.find(function(place) {
      return Math.abs(place.shapeData.lat - lat) < 0.00000001 && Math.abs(place.shapeData.lng - lng) < 0.00000001;
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
