app.service("PlaceService", ["$http", "PLACES_SERVICE_URL", "Shape", function($http, PLACES_SERVICE_URL, Shape) {
  var PlaceService = {};

  PlaceService.create = function(place) {
    var newPlace = Object.assign(place);
    delete newPlace.gmObject;
    return new Promise(function(resolve, reject) {
      $http.post(PLACES_SERVICE_URL + '/place', newPlace)
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

  PlaceService.getRecentPlacesForUsersNetwork = function(userId) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/user/' + userId + '/follows/places')
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.search = function(q) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/places?search=' + q)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.update = function(place) {
    var newPlace = Object.assign(place);
    delete newPlace.gmObject;
    return new Promise(function(resolve, reject) {
      $http.put(PLACES_SERVICE_URL + '/place/' + newPlace.id, newPlace)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.updateUserPlace = function(userId, place) {
    var newPlace = Object.assign(place);
    delete newPlace.gmObject;
    return new Promise(function(resolve, reject) {
      $http.put(PLACES_SERVICE_URL + '/user/' + userId + '/place/' + newPlace.id, newPlace)
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

  PlaceService.getPopularPlaces = function() {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/places/popular')
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.getRecentPlacesForUser = function(userId) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/user/' + userId + '/places')
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.searchPlacesByLocation = function(coords) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/place?minLat=' + coords.minLat + '&maxLat=' + coords.maxLat + '&minLng=' + coords.minLng + '&maxLng=' + coords.maxLng)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  PlaceService.calculateBounds = function(place) {
    return Shape.calculateBounds(place.shapeData);
  }

  return PlaceService;
}]);
