app.controller("signupController", ["$scope", "$location", "UserService", function($scope, $location, UserService) {
  $scope.username = null;
  $scope.email = null;
  $scope.password = null;

  $scope.errorMessage = null;

  $scope.redirect = $location.search().redirect;

  $scope.emailPattern = /^[a-z0-9\.\-_]+@[a-z0-9\.\-_]+\.[a-z]+$/i;
  $scope.usernamePattern = /^[a-z0-9\.\-_]+$/i;

  $scope.signup = function() {
    $scope.errorMessage = null;
    if ($scope.signupForm.$valid) {
      UserService.create($scope.username, $scope.email, $scope.password)
      .then(function() {
        $location.path($scope.redirect || '/home').search('redirect', null);
        $scope.$apply();
      })
      .catch(function(err) {
        console.error(err);
        $scope.errorMessage = "There was a problem creating your account";
        $scope.$apply();
      });
    }
  }

}]);
