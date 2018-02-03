app.controller("homeController", ["$scope", "ListService", "UserService", function($scope, ListService, UserService) {
  $scope.user = UserService.getUser();
  $scope.followedLists = [];

  ListService.getListsFollowedByUser($scope.user.id)
  .then(function(lists) {
    $scope.completedLists = lists.filter(function(l) { return l.numberOfPlaces == l.numberOfVisited; });
    $scope.followedLists = lists.filter(function(l) { return l.numberOfPlaces != l.numberOfVisited; });
    $scope.$apply();
  })
  .catch(function(err) {
    console.error("Couldn't load lists", err);
    $scope.$apply();
  });

}]);
