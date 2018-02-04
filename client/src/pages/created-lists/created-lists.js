app.controller("createdListsController", ["$scope", "ListService", "UserService", function($scope, ListService, UserService) {
  $scope.user = UserService.getUser();
  $scope.createdLists = [];

  ListService.getListsCreatedByUser($scope.user.id)
  .then(function(lists) {
    $scope.createdLists = lists.filter(function(l) { return l.numberOfPlaces != l.numberOfVisited; });
    $scope.$apply();
  })
  .catch(function(err) {
    console.error("Couldn't load lists for user", err);
    $scope.$apply();
  });

}]);
