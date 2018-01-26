app.directive("pageHeader", [function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/components/page-header/page-header.html',
    link: function($scope, $elem, $attr) {

      $scope.toggleMenu = function() {
        $scope.isMenuDisplayed = $scope.isMenuDisplayed ? false : true;
      }

      $scope.$on("$routeChangeStart", function(e) {
        $scope.isMenuDisplayed = false;
      });

    }
  }
}]);
