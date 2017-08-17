if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition, positionErrorHandler);
}

var map;
var drawingManager;

var centerCoords;
var DEFAULT_COORDS = { lat: 39.5464, lng: -97.3296 };
var DEFAULT_ZOOM = 4;
var SPECIFIC_ZOOM = 7;
var shapeList = [];

function showPosition(position) {
  centerCoords = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  }
  console.log("got location");
  if (map) {
    var center = new google.maps.LatLng(centerCoords.lat, centerCoords.lng);
    map.panTo(center);
    map.setZoom(SPECIFIC_ZOOM);
  }
}

function positionErrorHandler(error) {
  console.warn("Couldn't get location of device");
  centerCoords = {
    lat: 0,
    lng: 0
  }
}

function initMap() {
  console.log("initMap");
  var coords = centerCoords || DEFAULT_COORDS;
  var zoom = centerCoords ? SPECIFIC_ZOOM : DEFAULT_ZOOM;
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: zoom,
    center: coords,
    mapTypeId: 'roadmap'
  });

  initDrawingManager();
  initializeShapeList();
}

function initDrawingManager() {
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['marker', 'polygon', 'polyline']
    }
    // markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'}
  });
  drawingManager.setMap(map);
  google.maps.event.addListener(drawingManager, 'polygoncomplete', polygonComplete);
}

function polygonComplete(gmPolygon) {
  drawingManager.setDrawingMode(null);
  var pts = [];
  gmPolygon.getPath().forEach(function(latLng) {
    pts.push({
      lat: latLng.lat(),
      lng: latLng.lng()
    });
  });
  var polygon = Polygon.create(pts, gmPolygon);
  gmPolygon.shapeId = polygon.id;
  addShapeToList(polygon);
  google.maps.event.addListener(gmPolygon, "click", shapeClick);
}

function shapeClick(evt) {
  var gmObject = this;
  var clickedShape = shapeList.find(function(sh) {
    return sh.id == gmObject.shapeId;
  });
  console.log(clickedShape);
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

var Polygon = {};
Polygon.create = function(pts, gmObject) {
  var p = {
    'id': Math.round(Math.random() * 10000),
    'type': 'polygon',
    'coords': pts,
    'gmObject': gmObject,
    'name': null
  }
  return p;
}
