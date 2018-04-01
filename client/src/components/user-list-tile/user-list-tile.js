app.directive("userListTile", [function() {
  return {
    restrict: 'E',
    scope: {
      userList: '='
    },
    templateUrl: '/components/user-list-tile/user-list-tile.html'
  }
}])
