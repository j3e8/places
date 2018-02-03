app.directive("listTile", [function() {
  return {
    restrict: 'E',
    scope: {
      list: '='
    },
    templateUrl: '/components/list-tile/list-tile.html',
    link: function($scope, $elem, $attr) {

    }
  }
}])
