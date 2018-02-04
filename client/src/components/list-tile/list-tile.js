app.directive("listTile", [function() {
  return {
    restrict: 'E',
    scope: {
      list: '='
    },
    templateUrl: '/components/list-tile/list-tile.html',
    link: function($scope, elem, attrs) {
      $scope.editable = false;
      if (attrs.$attr.editable !== undefined) {
        $scope.editable = true;
      }
    }
  }
}])
