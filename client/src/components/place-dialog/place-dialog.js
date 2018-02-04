app.directive("placeDialog", ["Shape", "MapService", "PlaceService", "$timeout", function(Shape, MapService, PlaceService, $timeout) {
  return {
    restrict: 'E',
    scope: {
      'show': '=',
      'place': '=?',
      'center': '=',
      'zoom': '=',
      'onCancel': '=',
      'onSave': '='
    },
    templateUrl: '/components/place-dialog/place-dialog.html',
    link: function($scope, $elem, $attrs) {
      $scope.shapeTypes = [
        'Point',
        'Polygon',
        'Polyline'
      ];

      var map;
      var drawingManager;
      var gmObject;

      var DEFAULT_COORDS = { 'lat': 39.5464, 'lng': -97.3296 };
      var DEFAULT_ZOOM = 4;
      var SEARCH_ZOOM = 12;

      MapService.load()
      .then(function() {
        initMap();
        $scope.$apply();
      })
      .catch(function(err) {
        console.error(err);
      });

      $scope.$watch("place", function() {
        if (!$scope.place) {
          $scope.reset();
        }
      });

      $scope.$watch("show", function() {
        if ($scope.show) {
          $timeout(function() {
            google.maps.event.trigger(map, "resize");
            map.setCenter(new google.maps.LatLng($scope.center));
            map.setZoom($scope.zoom);
          }, 20);
        }
      });

      $scope.reset = function() {
        if ($scope.place && $scope.place.gmObject) {
          $scope.place.gmObject.setMap(null);
        }
        $scope.place = {
          'shapeType': 'Point',
          'placeName': 'New Place',
          'placeTypeId': $scope.placeTypes ? $scope.placeTypes.find(function(pt) { return pt.placeType.toLowerCase() == 'point of interest'; }).id : null
        }
        document.getElementById('gm-input').value = '';
      }

      PlaceService.loadPlaceTypes()
      .then(function(placeTypes) {
        $scope.placeTypes = placeTypes;
        if ($scope.place && !$scope.place.placeTypeId) {
          $scope.place.placeTypeId = $scope.placeTypes.find(function(pt) { return pt.placeType.toLowerCase() == 'point of interest'; }).id;
        }
        $scope.$apply();
      })
      .catch(function(err) {
        console.error("Couldn't load place types", err);
        $scope.$apply();
      });

      $scope.save = function() {
        var createOrUpdate = $scope.place.id ? PlaceService.update : PlaceService.create;
        var p = Object.assign({}, $scope.place);
        p.gmObject = undefined;
        createOrUpdate(p)
        .then(function(place) {
          if ($scope.onSave) {
            place.shapeData = JSON.parse(place.shapeData);
            if (place.gmObject) {
              place.gmObject.setMap(null);
            }
            $scope.onSave(place);
            $scope.reset();
          }
          $scope.$apply();
        })
        .catch(function(err) {
          console.error(err);
          $scope.$apply();
        });
      }

      $scope.cancel = function() {
        $scope.place = null;
        if ($scope.onCancel) {
          $scope.onCancel();
        }
      }

      $scope.setDrawingMode = function(tool) {
        if (tool == 'pan') {
          tool = null;
        }
        drawingManager.setDrawingMode(tool);
      }

      function initMap() {
        console.log('initMap', $scope.center);
        var zoom = DEFAULT_ZOOM;
        map = new google.maps.Map(document.getElementById('place-dialog-map'), {
          zoom: zoom,
          center: new google.maps.LatLng($scope.center),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          gestureHandling: 'greedy'
        });
        map.setOptions({ styles: CUSTOM_MAP_STYLES });
        initDrawingManager();
        initSearchBox();
      }

      function initDrawingManager() {
        drawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: false,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'polygon', 'polyline']
          }
        });
        drawingManager.setMap(map);
        drawingManager.setDrawingMode(null);
        google.maps.event.addListener(drawingManager, 'markercomplete', markerComplete);
        google.maps.event.addListener(drawingManager, 'polygoncomplete', polygonComplete);
        google.maps.event.addListener(drawingManager, 'polylinecomplete', polylineComplete);
      }

      function initSearchBox() {
        var input = document.getElementById('gm-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          console.log(places);
          if (places.length == 1) {
            var lat = places[0].geometry.location.lat();
            var lng = places[0].geometry.location.lng();
            map.setZoom(SEARCH_ZOOM);
            map.setCenter(new google.maps.LatLng({ lat: lat, lng: lng }));
          }
        });
      }

      function markerComplete(gmMarker) {
        $scope.place.shapeType = Shape.POINT;
        gmObject = gmMarker;
        $scope.place.gmObject = gmObject;
        $scope.place.shapeData = Shape.pointFromGMMarker(gmMarker);
        drawingManager.setDrawingMode(null);
        gmMarker.setDraggable(true);
      }

      function polygonComplete(gmPolygon) {
        $scope.place.shapeType = Shape.POLYGON;
        gmObject = gmPolygon;
        $scope.place.shapeData = Shape.polygonFromGMPolygon(gmPolygon);
        drawingManager.setDrawingMode(null);
        gmPolygon.setEditable(true);
      }

      function polylineComplete(gmPolyline) {
        $scope.place.shapeType = Shape.POLYLINE;
        gmObject = gmPolyline;
        drawingManager.setDrawingMode(null);
        gmPolyline.setEditable(true);
      }

    }
  }
}]);
