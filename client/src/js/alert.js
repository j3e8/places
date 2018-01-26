app.service("alert", ["$rootScope", function($rootScope) {
  return function(msg, isError) {
    $rootScope.$broadcast('alert', {
      message: msg,
      isError: isError
    });
  }
}]);
