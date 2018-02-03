app.controller("listController", ["$scope", "$routeParams", "MapService", "PlaceService", "ListService", "UserService", "alert", "$timeout", "$location",
function($scope, $routeParams, MapService, PlaceService, ListService, UserService, alert, $timeout, $location) {
  var map;

  var user = UserService.getUser();

  MapService.load()
  .then(function() {
    initMap();
    ListService.get($routeParams.listId)
    .then(function(list) {
      $scope.list = list;
      $scope.list.places.forEach(function(place) {
        MapService.addPlaceToMap(map, place);
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

  $scope.handleFollowChange = function() {
    if (!user || !user.id) {
      return;
    }
    $scope.list.isFollowed = !$scope.list.isFollowed;
    if ($scope.list.isFollowed) {
      ListService.follow(user.id, $scope.list.id)
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
      ListService.unfollow(user.id, $scope.list.id)
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
    PlaceService.updateUserPlace(user.id, p)
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
  }

}]);
