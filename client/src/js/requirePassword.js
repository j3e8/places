app.service("requirePassword", ["$rootScope", function($rootScope) {
  return function(data) {
    $rootScope.$broadcast('requirePassword', data);
  }
}]);
