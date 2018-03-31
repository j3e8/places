app.controller("mainController", ["$rootScope", "$http", "$location", "PLACES_SERVICE_URL", "UserService",
function($rootScope, $http, $location, PLACES_SERVICE_URL, UserService) {
  $rootScope.user = UserService.getUser();

  var unauthenticatedRoutes = [
    '/',
    '/signin',
    '/signup'
  ];

  $rootScope.$on('signedout', function() {
    $rootScope.user = null;
  });

  $rootScope.$on('signedin', function() {
    $rootScope.user = UserService.getUser();
  });


  if ($rootScope.user && unauthenticatedRoutes.indexOf($location.path()) != -1) {
    $location.path('/home');
  }
}]);
