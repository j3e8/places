app.directive("listTile", [function() {
  return {
    restrict: 'E',
    scope: {
      list: '=',
      userId: '='
    },
    templateUrl: '/components/list-tile/list-tile.html',
    link: function($scope, elem, attrs) {
      $scope.editable = false;
      if (attrs.$attr.editable !== undefined) {
        $scope.editable = true;
      }

      $scope.getListUrl = function() {
        if ($scope.userId) {
          return "/list/" + $scope.list.id + "/user/" + $scope.userId;
        }
        return "/list/" + $scope.list.id;
      }
    }
  }
}])
