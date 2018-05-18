app.controller("signinController", ["$scope", "$location", "UserService", function($scope, $location, UserService) {
  $scope.username = null;
  $scope.password = null;

  $scope.errorMessage = null;

  $scope.redirect = $location.search().redirect;

  $scope.signin = function() {
    $scope.errorMessage = null;
    UserService.authenticate($scope.username, $scope.password)
    .then(function() {
      $location.path($scope.redirect || '/home').search('redirect', null);
      $scope.$apply();
    })
    .catch(function(err) {
      console.error(err);
      $scope.errorMessage = "Invalid username/password";
      $scope.$apply();
    });
  }

}]);
