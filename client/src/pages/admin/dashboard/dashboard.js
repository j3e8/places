app.controller("adminDashboardController", function($scope, ReportService) {

  ReportService.getCounts()
  .then(function(response) {
    $scope.totalUsers = response.users;
    $scope.totalLists = response.lists;
    $scope.totalPlaces = response.places;
    $scope.$apply();
  })
  .catch(function(err) { });

});
