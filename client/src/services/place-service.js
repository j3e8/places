app.service("PlaceService", ["$http", "PLACES_SERVICE_URL", function($http, PLACES_SERVICE_URL) {
  var PlaceService = {};

  PlaceService.create = function(place) {
    return new Promise(function(resolve, reject) {
      $http.post(PLACES_SERVICE_URL + '/place', place)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.getPlace = function(placeId) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/place/' + placeId)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.update = function(place) {
    return new Promise(function(resolve, reject) {
      $http.put(PLACES_SERVICE_URL + '/place/' + place.id, place)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.updateUserPlace = function(userId, place) {
    return new Promise(function(resolve, reject) {
      $http.put(PLACES_SERVICE_URL + '/user/' + userId + '/place/' + place.id, place)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.loadPlaceTypes = function() {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/placetypes')
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.search = function(search) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/place?search=' + search)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.calculateBounds = function(place) {
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
    return {
      minLat: minLat,
      maxLat: maxLat,
      minLng: minLng,
      maxLng: maxLng
    }
  }

  function findMinProperty(arr, prop) {
    var val;
    arr.forEach(function(item) {
      var thisVal = item[prop];
      if (Object.prototype.toString.call(item) == '[object Array]') {
        thisVal = findMinProperty(item, prop);
      }
      if (thisVal !== undefined && (val === undefined || thisVal < val)) {
        val = thisVal;
      }
    });
    return val;
  }

  function findMaxProperty(arr, prop) {
    var val;
    arr.forEach(function(item) {
      var thisVal = item[prop];
      if (Object.prototype.toString.call(item) == '[object Array]') {
        thisVal = findMaxProperty(item, prop);
      }
      if (thisVal !== undefined && (val === undefined || thisVal > val)) {
        val = thisVal;
      }
    });
    return val;
  }

  return PlaceService;
}]);
