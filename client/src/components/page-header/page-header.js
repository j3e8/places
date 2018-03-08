app.directive("pageHeader", ["UserService", "$location", function(UserService, $location) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/components/page-header/page-header.html',
    link: function($scope, $elem, $attr) {
      $scope.isMenuDisplayed = undefined;
      $scope.search = null;

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

      $scope.doSearch = function() {
        if (!$scope.search) {
          return;
        }
        $location.path('/search').search('q', $scope.search);
        $scope.search = null;
      }

    }
  }
}]);
