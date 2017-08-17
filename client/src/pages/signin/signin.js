app.controller("signinController", ["$scope", "$location", "UserService", function($scope, $location, UserService) {
  $scope.username = null;
  $scope.password = null;

  $scope.errorMessage = null;

  $scope.signin = function() {
    $scope.errorMessage = null;
    UserService.authenticate($scope.username, $scope.password)
    .then(function() {
      $location.path('/dashboard');
      $scope.$apply();
    })
    .catch(function(err) {
      console.error(err);
      $scope.errorMessage = "Invalid username/password";
      $scope.$apply();
    });
  }

}]);
