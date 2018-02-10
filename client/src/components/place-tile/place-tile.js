app.directive("placeTile", [function() {
  return {
    restrict: 'E',
    scope: {
      place: '=',
      onEdit: '='
    },
    templateUrl: '/components/place-tile/place-tile.html',
    link: function($scope, $elem, attrs) {
      $scope.editPlace = function() {
        if ($scope.onEdit) {
          $scope.onEdit($scope.place);
        }
      }
    }
  }
}])
