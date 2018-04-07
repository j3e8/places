app.directive("pageFooter", [function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/components/page-footer/page-footer.html',
    link: function($scope, $elem, $attr) {
      $scope.dateYear = new Date().getFullYear();
    }
  }
}]);
