app.controller("listController", ["$scope", "$routeParams", "MapService", "PlaceService", "ListService", "alert", "$timeout", "$location",
function($scope, $routeParams, MapService, PlaceService, ListService, alert, $timeout, $location) {
  var map;

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
