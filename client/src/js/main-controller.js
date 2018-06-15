app.controller("mainController", ["$rootScope", "$http", "$location", "PLACES_SERVICE_URL", "UserService",
function($rootScope, $http, $location, PLACES_SERVICE_URL, UserService) {
  $rootScope.user = UserService.getUser();

  var unauthenticatedRoutes = [
    '/',
    '/signin',
    '/signup'
  ];

  var accessibleRoutes = [
    '/privacy',
    '/terms',
    '/list/:listId/user/:userId'
  ];

  $rootScope.$on('signedout', function() {
    $rootScope.user = null;
  });

  $rootScope.$on('signedin', function() {
    $rootScope.user = UserService.getUser();
  });

  if (findPath($location.path(), accessibleRoutes)) {
    if ($rootScope.user && unauthenticatedRoutes.indexOf($location.path()) != -1) {
      $location.path('/home');
    }
    else if (!$rootScope.user && findPath($location.path(), unauthenticatedRoutes)) {
      var path = $location.url();
      $location.path('/').search('redirect', path);
    }
  }

  function findPath(path, routes) {
    if (routes.indexOf(path) != -1) {
      return true;
    }
    var match = routes.find(function(route) {
      return pathMatchesRoute(path, route);
    });
    return match ? true : false;
  }

  function pathMatchesRoute(path, route) {
    var pathParts = path.split('/');
    var routeParts = route.split('/');
    if (pathParts.length != routeParts.length) {
      return false;
    }
    for (var i=0; i < pathParts.length; i++) {
      if (routeParts[i][0] == ':' || routeParts[i][0] == '*') {
        continue;
      }
      else if (pathParts[i] != routeParts[i]) {
        return false;
      }
    }
    return true;
  }
}]);
