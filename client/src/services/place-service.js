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

  return PlaceService;
}]);
