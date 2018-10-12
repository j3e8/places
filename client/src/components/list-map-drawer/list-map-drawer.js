app.directive("listMapDrawer", function($routeParams, $timeout, ListService, MapService, ClusterService) {
  return {
    restrict: 'E',
    scope: {
      list: '=',
      onClick: '<',
      placeChanged: '<',
      highlightPlace: '<',
      user: '='
    },
    templateUrl: '/components/list-map-drawer/list-map-drawer.html',
    link: function($scope, $elem, $attrs) {
      var clusterer, map;
      var DEFAULT_COORDS = { lat: 39.5464, lng: -97.3296 };
      $scope.centerCoords = DEFAULT_COORDS;

      $scope.$watch('list', function() {
        initList();
      })

      MapService.load()
      .then(function() {
        initMap();
        clusterer = ClusterService.createClusterer(map, $scope.placeClicked);
        initList();
      })
      .catch(function(err) {
        console.error(err);
      });

      $scope.$on('place-changed', function($evt, place) {

      });

      $scope.$on('highlight-place', function($evt, data) {
        var place = data.place;
        // MapService.updatePlaceOnMap(map, place);
        ClusterService.update(clusterer);
        if (data.zoomTo) {
          MapService.zoomToPlace(map, place);
        }
      });

      $scope.placeClicked = function(gmEvent) {
        var gmObject = this;

        var clickedPlace = $scope.list.places.find(function(place) {
          return place.id == gmObject.shapeId;
        });

        if (clickedPlace) {
          if ($scope.highlightPlace) {
            $scope.highlightPlace(clickedPlace, false, true);
          }
          // MapService.updatePlaceOnMap(map, clickedPlace);
          ClusterService.update(clusterer);
        }
        $scope.$apply();
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

      function initList() {
        if (!clusterer || !map || !$scope.list) {
          return;
        }
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
      }

      function mapClick() {
        $scope.list.places.forEach(function(place) {
          place.highlighted = false;
        });
        ClusterService.update(clusterer);
        $scope.$apply();
      }

    }
  }

});
