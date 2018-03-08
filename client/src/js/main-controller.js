app.controller("mainController", ["$rootScope", "$http", "$location", "PLACES_SERVICE_URL", "UserService",
function($rootScope, $http, $location, PLACES_SERVICE_URL, UserService) {
  $rootScope.user = UserService.getUser();

  var authenticatedRoutes = [
    '/admin',
    '/created-lists',
    '/list/new',
    '/list/:listId/edit'
  ];

  if (!UserService.isSignedIn() && authenticatedRoutes.indexOf($location.path()) != -1) {
    $location.path('/signin');
  }

  $rootScope.$on('signedout', function() {
    $rootScope.user = null;
  });

  $rootScope.$on('signedin', function() {
    $rootScope.user = UserService.getUser();
  });
}]);
