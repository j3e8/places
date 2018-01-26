app.controller("homeController", ["$scope", "ListService", "UserService", function($scope, ListService, UserService) {
  $scope.user = UserService.getUser();
  $scope.lists = [];

  ListService.getListsForUser($scope.user.id)
  .then(function(lists) {
    $scope.lists = lists;
    $scope.$apply();
  })
  .catch(function(err) {
    console.error("Couldn't load lists", err);
    $scope.$apply();
  });

}]);
