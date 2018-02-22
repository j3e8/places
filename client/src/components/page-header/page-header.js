app.directive("pageHeader", ["UserService", "$location", function(UserService, $location) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/components/page-header/page-header.html',
    link: function($scope, $elem, $attr) {
      $scope.isMenuDisplayed = undefined;

      $scope.toggleMenu = function() {
        $scope.isMenuDisplayed = $scope.isMenuDisplayed ? false : true;
      }

      $scope.$on("$routeChangeStart", function(e) {
        if ($scope.isMenuDisplayed) {
          $scope.isMenuDisplayed = false;
        }
      });

      $scope.signout = function() {
        UserService.signOut();
        $location.path('/signin');
      }

    }
  }
}]);
