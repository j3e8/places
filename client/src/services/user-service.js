app.service("UserService", ["$http", "$rootScope", "$timeout", "PLACES_SERVICE_URL", function($http, $rootScope, $timeout, PLACES_SERVICE_URL) {
  var UserService = {};
  var authToken = null;
  var user = null;

  try {
    authToken = localStorage.getItem('authToken');
    if (authToken) {
      initToken(authToken);
    }
    user = JSON.parse(localStorage.getItem('user'));
  } catch(err) { }

  UserService.create = function(username, email, password) {
    var user = {
      'username': username,
      'email': email,
      'password': password
    }
    return new Promise(function(resolve, reject) {
      $http.post(PLACES_SERVICE_URL + '/user', user)
      .then(function(response) {
        var tok = response.data;
        initToken(tok);
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
        var tok = response.data;
        initToken(tok);
        resolve();
      }, function(err) {
        reject(err);
      });
    });
  }

  UserService.getUser = function() {
    return user;
  }

  UserService.getUserById = function(userId) {
    if (!userId || (user && user.id == userId)) {
      return Promise.resolve(user);
    }
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/user/' + userId)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  UserService.isSignedIn = function() {
    return authToken && user && !isTokenExpired() ? true : false;
  }

  UserService.signOut = function() {
    destroyToken();
  }

  function initToken(tok) {
    authToken = tok;
    $http.defaults.headers.common.Authorization = 'Bearer ' + authToken;
    var parts = authToken.split('.');
    var parsed = JSON.parse(atob(parts[1]));
    user = parsed.user;

    try {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(user));
    } catch(err) {
      console.warn("Couldn't set user to localStorage");
    }

    var msUntilExpiration = parsed.exp ? (parsed.exp * 1000) - new Date().getTime() : 0;
    if (msUntilExpiration > 0) {
      var refreshIn = msUntilExpiration - 1000 * 300;
      if (refreshIn < 0) {
        refreshIn = 0;
      }
      refreshTimer = $timeout(refreshToken, refreshIn);
    }
    else {
      $rootScope.$broadcast("signedout", {});
      destroyToken();
    }
  }

  function isTokenExpired() {
    var parts = authToken.split('.');
    var parsed = JSON.parse(atob(parts[1]));
    if (new Date().getTime() >= parsed.exp * 1000) {
      return true;
    }
    return false;
  }

  function refreshToken() {
    $http.post(PLACES_SERVICE_URL + '/user/authenticate')
    .then(function(response) {
      var tok = response.data;
      initToken(tok);
    }, function (err) {
      destroyToken();
      return console.error(err);
    });
  }

  function destroyToken() {
    authToken = null;
    user = null;
    $http.defaults.headers.common.Authorization = undefined;
    $rootScope.$broadcast("signedout", {});
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')
    } catch(err) { }
  }

  return UserService;
}]);
