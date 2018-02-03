app.controller("listsController", ["$scope", "ListService", "UserService", function($scope, ListService, UserService) {
  $scope.popularLists = [];

  ListService.getPopularLists()
  .then(function(popularLists) {
    $scope.popularLists = popularLists;
    $scope.$apply();
  })
  .catch(function(err) {
    console.error("Couldn't load lists", err);
    $scope.$apply();
  });

}]);
