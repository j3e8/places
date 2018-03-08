app.controller("searchController", ["$scope", "$location", "UserService", "PlaceService", "ListService", "alert", "$location",
function($scope, $location, UserService, PlaceService, ListService, alert, $location) {
  $scope.search = $location.search().q;
  $scope.activeTab = 'lists';

  $scope.doSearch = function() {
    $location.search('q', $scope.search);
    $scope.isLoading = true;
    Promise.all([
      ListService.search($scope.search).catch(function(err) { return Promise.resolve(null); }),
      PlaceService.search($scope.search).catch(function(err) { return Promise.resolve(null); }),
      UserService.search($scope.search).catch(function(err) { return Promise.resolve(null); })
    ])
    .then(function(results) {
      $scope.lists = results[0];
      $scope.places = results[1];
      $scope.users = results[2];
      $scope.isLoading = false;
      $scope.$apply();
    })
    .catch(function(err) {
      $scope.isLoading = false;
      $scope.$apply();
    });
  }
  $scope.doSearch();

  $scope.selectTab = function(tab) {
    $scope.activeTab = tab;
  }

}]);
