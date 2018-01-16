app.controller("mainController", ["$scope", "$http", "$location", "PLACES_SERVICE_URL", "UserService",
function($scope, $http, $location, PLACES_SERVICE_URL, UserService) {
  $scope.user = UserService.getUser();
  if (!UserService.isSignedIn() && $location.path() != '/signin') {
    $location.path('/signin');
  }
}]);
