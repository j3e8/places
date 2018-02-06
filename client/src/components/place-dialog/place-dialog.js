app.directive("placeDialog", ["Shape", "MapService", "PlaceService", "$timeout", function(Shape, MapService, PlaceService, $timeout) {
  return {
    restrict: 'E',
    scope: {
      'show': '=',
      'placeId': '=',
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

      $scope.$watch("placeId", function() {
        if ($scope.placeId) {
          PlaceService.getPlace($scope.placeId)
          .then(function(place) {
            $scope.place = place;
            $timeout(function() {
              MapService.addPlaceToMap(map, $scope.place, null);
              $scope.place.gmObject.setEditable(true);
              // if ($scope.place.shapeType == 'polygon') {
              //   console.log('polygon');
              //   var p = $scope.place.gmObject.getPath();
              //   console.log('path', p);
              //   google.maps.event.addListener(p, 'insert_at', polygonEdited);
              //   google.maps.event.addListener(p, 'remove_at', polygonEdited);
              //   google.maps.event.addListener(p, 'set_at', polygonEdited);
              // }
              var placeBounds = PlaceService.calculateBounds($scope.place);
              var bounds = new google.maps.LatLngBounds();
              bounds.extend({ lat: placeBounds.minLat, lng: placeBounds.minLng });
              bounds.extend({ lat: placeBounds.maxLat, lng: placeBounds.maxLng });
              map.fitBounds(bounds);
            }, 1);
            $scope.$apply();
          });
        }
        else {
          $scope.place = null;
          $scope.reset();
        }
      });

      $scope.$watch("show", function() {
        if ($scope.show && map) {
          $timeout(function() {
            google.maps.event.trigger(map, "resize");
            if ($scope.center && !$scope.placeId) {
              map.setCenter(new google.maps.LatLng($scope.center));
            }
          }, 20);
        }
      });

      $scope.reset = function() {
        console.log('reset');
        if ($scope.place && $scope.place.gmObject) {
          removeShapesFromMap($scope.place.gmObject);
        }
        $scope.place = {
          'shapeType': 'Point',
          'placeName': 'New Place',
          'placeTypeId': $scope.placeTypes ? $scope.placeTypes.find(function(pt) { return pt.placeType.toLowerCase() == 'point of interest'; }).id : null
        }
        document.getElementById('gm-input').value = '';
        if (map) {
          map.setZoom(DEFAULT_ZOOM);
        }
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
        $scope.place.shapeData = makeShapeDataFromMapObject($scope.place.gmObject);
        var gmObject = $scope.place.gmObject;
        $scope.place.gmObject = undefined;
        createOrUpdate($scope.place)
        .then(function(place) {
          if ($scope.onSave) {
            place.shapeData = JSON.parse(place.shapeData);
            removeShapesFromMap(gmObject);
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
        if ($scope.place.gmObject) {
          $scope.place.gmObject.setMap(null);
        }
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
          },
          polygonOptions: {
            strokeColor: '#c67788',
            fillColor: '#ef8f9f'
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
          if (places.length == 1) {
            var lat = places[0].geometry.location.lat();
            var lng = places[0].geometry.location.lng();
            map.setZoom(SEARCH_ZOOM);
            map.setCenter(new google.maps.LatLng({ lat: lat, lng: lng }));
          }
        });
      }

      function makeShapeDataFromMapObject(gmObject) {
        switch ($scope.place.shapeType) {
          case Shape.POLYGON:
            return Shape.polygonFromGMPolygon(gmObject);
          case Shape.POLYLINE:
            return Shape.polylineFromGMPolyline(gmObject);
          case Shape.POINT:
            return Shape.pointFromGMMarker(gmObject);
          default: return;
        }
      }

      function removeShapesFromMap(gmObject) {
        if (gmObject) {
          if (Object.prototype.toString.call(gmObject) == '[object Array]') {
            gmObject.forEach(function(o) {
              o.setMap(null);
            });
          }
          else {
            gmObject.setMap(null);
          }
        }
      }

      function markerComplete(gmMarker) {
        if ($scope.place.gmObject) {
          $scope.place.gmObject.setMap(null);
        }
        $scope.place.shapeType = Shape.POINT;
        $scope.place.gmObject = gmMarker;
        drawingManager.setDrawingMode(null);
        gmMarker.setDraggable(true);
      }

      function polygonComplete(gmPolygon) {
        if ($scope.place.shapeType != Shape.POLYGON || !$scope.place.gmObject) {
          $scope.place.gmObject = gmPolygon;
        }
        else {
          var poly = Shape.polygonFromGMPolygon($scope.place.gmObject);
          if (!isArrayOfArrays(poly)) {
            poly = [ poly ];
          }
          var newpoly = Shape.polygonFromGMPolygon(gmPolygon);
          poly = poly.concat(newpoly);
          $scope.place.gmObject.setPaths(poly); // add the new polygon to the existing one
          gmPolygon.setMap(null); // remove this new polygon from the map
        }
        $scope.place.shapeType = Shape.POLYGON;
        drawingManager.setDrawingMode(null);
        gmPolygon.setEditable(true);
      }

      function isArrayOfArrays(arr) {
        if (Object.prototype.toString.call(arr) == '[object Array]') {
          if (Object.prototype.toString.call(arr[0]) == '[object Array]') {
            return true;
          }
        }
        return false;
      }

      function polylineComplete(gmPolyline) {
        if ($scope.place.shapeType != Shape.POLYLINE) {
          $scope.place.gmObject = null;
        }
        $scope.place.shapeType = Shape.POLYLINE;
        $scope.place.gmObject = gmPolyline;
        drawingManager.setDrawingMode(null);
        gmPolyline.setEditable(true);
      }

    }
  }
}]);
