app.controller("adminDashboardController", function($scope, ReportService) {

  requirePassword({
    afterAuthenticate: function() {

      ReportService.getCounts()
      .then(function(response) {
        $scope.totalUsers = response.users;
        $scope.totalLists = response.lists;
        $scope.totalPlaces = response.places;
        $scope.$apply();
      })
      .catch(function(err) { });

      ReportService.getRecentUsers()
      .then(function(users) {
        $scope.recentUsers = users;
        $scope.$apply();
      })
      .catch(function(err) { });

      ReportService.getRecentLists()
      .then(function(lists) {
        $scope.recentLists = lists;
        $scope.$apply();
      })
      .catch(function(err) { });

      ReportService.getRecentPlaces()
      .then(function(places) {
        $scope.recentPlaces = places;
        $scope.$apply();
      })
      .catch(function(err) { });

    }
  });
  
});
