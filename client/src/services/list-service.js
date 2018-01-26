app.service("ListService", ["$http", "PLACES_SERVICE_URL", function($http, PLACES_SERVICE_URL) {
  var ListService = {};

  ListService.create = function(list) {
    return new Promise(function(resolve, reject) {
      $http.post(PLACES_SERVICE_URL + '/list', list)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.get = function(listId) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/list/' + listId)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.getListsForUser = function(userId) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/user/' + userId + '/lists')
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.update = function(listId, list) {
    return new Promise(function(resolve, reject) {
      $http.put(PLACES_SERVICE_URL + '/list/' + listId, list)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.calculateBounds = function(list) {
    var bounds = {};
    list.places.forEach(function(place) {
      var minLat, maxLat, minLng, maxLng;
      if (Object.prototype.toString.call(place.shapeData) == '[object Array]') {
        minLat = findMinProperty(place.shapeData, 'lat');
        maxLat = findMaxProperty(place.shapeData, 'lat');
        minLng = findMinProperty(place.shapeData, 'lng');
        maxLng = findMaxProperty(place.shapeData, 'lng');
      }
      else {
        minLat = place.shapeData.lat;
        maxLat = place.shapeData.lat;
        minLng = place.shapeData.lng;
        maxLng = place.shapeData.lng;
      }
      if (bounds.minLat === undefined || minLat < bounds.minLat) bounds.minLat = minLat;
      if (bounds.maxLat === undefined || maxLat > bounds.maxLat) bounds.maxLat = maxLat;
      if (bounds.minLng === undefined || minLng < bounds.minLng) bounds.minLng = minLng;
      if (bounds.maxLng === undefined || maxLng > bounds.maxLng) bounds.maxLng = maxLng;
    });
    return bounds;
  }

  function findMinProperty(arr, prop) {
    var val;
    arr.forEach(function(item) {
      if (item[prop] !== undefined && (val === undefined || item[prop] < val)) {
        val = item[prop];
      }
    });
    return val;
  }

  function findMaxProperty(arr, prop) {
    var val;
    arr.forEach(function(item) {
      if (item[prop] !== undefined && (val === undefined || item[prop] > val)) {
        val = item[prop];
      }
    });
    return val;
  }

  return ListService;
}]);
