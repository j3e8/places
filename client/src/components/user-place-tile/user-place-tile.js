app.directive("userPlaceTile", [function() {
  return {
    restrict: 'E',
    scope: {
      userPlace: '='
    },
    templateUrl: '/components/user-place-tile/user-place-tile.html'
  }
}])
