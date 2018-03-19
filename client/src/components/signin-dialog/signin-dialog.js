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
        console.log('$on requirePassword');
        if (UserService.isSignedIn()) {
          console.log('isSignedIn');
          if ($scope.afterAuthenticate) {
            console.log('call afterAuthenticate');
            $scope.afterAuthenticate();
          }
          return;
        }
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
          $scope.show = false;
          $scope.$apply();
        })
        .catch(function(err) {
          alert("Invalid username/password", true);
          $scope.isSigningIn = false;
          $scope.$apply();
        });
      }
    }
  }
}]);
