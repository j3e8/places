app.controller("mainController", ["$rootScope", "$http", "$location", "PLACES_SERVICE_URL", "UserService",
function($rootScope, $http, $location, PLACES_SERVICE_URL, UserService) {
  $rootScope.user = UserService.getUser();
  if (!UserService.isSignedIn() && $location.path() != '/signin') {
    $location.path('/signin');
  }
}]);
