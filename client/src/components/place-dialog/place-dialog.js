app.directive("placeDialog", ["Shape", "MapService", "PlaceService", "$timeout", function(Shape, MapService, PlaceService, $timeout) {
  return {
    restrict: 'E',
    scope: {
      'show': '=',
      'place': '=?',
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
          $scope.place = {
            'shapeType': 'Point',
            'placeName': 'New Place'
          };
        }
      });

      $scope.$watch("show", function() {
        if ($scope.show) {
          $timeout(function() {
            google.maps.event.trigger(map, "resize");
          }, 0);
        }
      });

      PlaceService.loadPlaceTypes()
      .then(function(placeTypes) {
        $scope.placeTypes = placeTypes;
        $scope.$apply();
      })
      .catch(function(err) {
        console.error("Couldn't load place types", err);
        $scope.$apply();
      });

      $scope.save = function() {
        console.log("save place", $scope.place);
        var createOrUpdate = $scope.place.id ? PlaceService.update : PlaceService.create;
        createOrUpdate($scope.place)
        .then(function(place) {
          if ($scope.onSave) {
            $scope.onSave(place);
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
        var coords = new google.maps.LatLng(DEFAULT_COORDS.lat, DEFAULT_COORDS.lng);
        var zoom = DEFAULT_ZOOM;
        map = new google.maps.Map(document.getElementById('place-dialog-map'), {
          'zoom': zoom,
          'center': coords,
          'mapTypeId': google.maps.MapTypeId.ROADMAP
        });

        initDrawingManager();
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

      function markerComplete(gmMarker) {
        $scope.place.shapeType = Shape.POINT;
        gmObject = gmMarker;
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
