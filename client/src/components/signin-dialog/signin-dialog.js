app.directive("signinDialog", ["UserService", "alert", "$rootScope", function(UserService, alert, $rootScope) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/components/signin-dialog/signin-dialog.html',
    link: function($scope, $elem, $attrs) {
      $scope.password = null;
      $scope.afterAuthenticate = null;

      $rootScope.$on('requirePassword', function(event, data) {
        $scope.afterAuthenticate = data.afterAuthenticate;
        if (UserService.isSignedIn()) {
          if ($scope.afterAuthenticate) {
            $scope.afterAuthenticate();
          }
          return;
        }
        $scope.isSigningIn = false;
        $scope.password = null;
        $scope.show = true;
      });

      $scope.signin = function() {
        var user = UserService.getUser();
        $scope.isSigningIn = true;
        UserService.authenticate(user.username, $scope.password)
        .then(function() {
          if ($scope.afterAuthenticate) {
            $scope.afterAuthenticate();
          }
          $scope.isSigningIn = false;
          $scope.show = false;
          $scope.password = null;
          $scope.$apply();
        })
        .catch(function(err) {
          alert("Invalid username/password", true);
          console.error(err);
          $scope.isSigningIn = false;
          $scope.$apply();
        });
      }
    }
  }
}]);
