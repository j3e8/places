app.directive("userTile", [function() {
  return {
    restrict: 'E',
    scope: {
      user: '=',
      size: '@'
    },
    templateUrl: '/components/user-tile/user-tile.html'
  }
}])
