app.controller("homeController", ["$scope", "ListService", "UserService", function($scope, ListService, UserService) {
  $scope.user = UserService.getUser();
  $scope.followedLists = [];
  $scope.createdLists = [];

  ListService.getListsForUser($scope.user.id)
  .then(function(createdLists) {
    $scope.createdLists = createdLists;
    $scope.$apply();
  })
  .catch(function(err) {
    console.error("Couldn't load lists", err);
    $scope.$apply();
  });

}]);
