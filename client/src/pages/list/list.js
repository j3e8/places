app.controller("listController", ["$scope", "MapService", function($scope, MapService) {
  $scope.list = [];
  $scope.newPlaceDialogIsDisplayed = undefined;

  var map;
  var drawingManager;

  var centerCoords;
  var DEFAULT_COORDS = { lat: 39.5464, lng: -97.3296 };
  var DEFAULT_ZOOM = 4;
  var SPECIFIC_ZOOM = 7;
  var shapeList = [];

  MapService.load()
  .then(function() {
    initMap();
  })
  .catch(function(err) {
    console.error(err);
  });

  $scope.showNewPlaceDialog = function() {
    $scope.newPlaceDialogIsDisplayed = true;
  }

  $scope.afterPlaceSave = function(place) {
    // TODO: add the place to the list
    $scope.closeNewPlaceDialog();
  }

  $scope.closeNewPlaceDialog = function() {
    $scope.newPlaceDialogIsDisplayed = false;
  }

  function initMap() {
    var coords = centerCoords || DEFAULT_COORDS;
    var zoom = centerCoords ? SPECIFIC_ZOOM : DEFAULT_ZOOM;
    map = new google.maps.Map(document.getElementById('list-map'), {
      zoom: zoom,
      center: coords,
      mapTypeId: 'roadmap'
    });

    initializeShapeList();
  }

  function addShapeToList(shape) {
    loadShapeList();
    shapeList.push(shape);
    var savableShapeList = shapeList.map(function(sh) {
      let obj = Object.assign({}, sh);
      delete obj.gmObject;
      return obj;
    });
    localStorage.setItem('shapeList', JSON.stringify(savableShapeList));
  }

  function loadShapeList() {
    var list = localStorage.getItem('shapeList');
    if (list) {
      list = JSON.parse(list);
    }
    else {
      list = [];
    }
    shapeList = list;
  }

  function initializeShapeList() {
    if (!map) {
      console.error("Can't initializeShapeList without map");
      return;
    }
    loadShapeList();
    shapeList.forEach(function(shape) {
      var gmPolygon = new google.maps.Polygon({
        shapeId: shape.id,
        paths: shape.coords,
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ff0000',
        fillOpacity: 0.35
      });
      gmPolygon.setMap(map);
      google.maps.event.addListener(gmPolygon, "click", shapeClick);
      shape.gmObject = gmPolygon;
    });
  }

}]);
