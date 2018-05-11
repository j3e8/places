app.service("ReportService", ["$http", "PLACES_SERVICE_URL", function($http, PLACES_SERVICE_URL) {
  var ReportService = {};

  ReportService.getCounts = function() {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/admin/count')
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  return ReportService;
}]);
