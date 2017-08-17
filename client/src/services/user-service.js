app.service("UserService", ["$http", "PLACES_SERVICE_URL", function($http, PLACES_SERVICE_URL) {
  var UserService = {};

  UserService.create = function(username, email, password) {
    var user = {
      'username': username,
      'email': email,
      'password': password
    }
    return new Promise(function(resolve, reject) {
      $http.post(PLACES_SERVICE_URL + '/user', user)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  UserService.authenticate = function(username, password) {
    var creds = {
      'username': username,
      'password': password
    }
    return new Promise(function(resolve, reject) {
      $http.post(PLACES_SERVICE_URL + '/user/authenticate', creds)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  return UserService;
}]);
