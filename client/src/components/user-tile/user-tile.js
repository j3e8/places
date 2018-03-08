app.directive("userTile", [function() {
  return {
    restrict: 'E',
    scope: {
      user: '='
    },
    templateUrl: '/components/user-tile/user-tile.html'
  }
}])
