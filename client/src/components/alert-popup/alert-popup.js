app.directive("alertPopup", ["$rootScope", "$timeout", function($rootScope, $timeout) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/components/alert-popup/alert-popup.html',
    link: function($scope, $elem, $attrs) {
      var TIMEOUT = 5000;
      $scope.message = '';
      $scope.isError = false;
      $scope.isDisplayed = undefined;

      $rootScope.$on('alert', function(event, data) {
        $scope.message = data.message;
        $scope.isError = data.isError ? true : false;
        $scope.show();
      });

      $scope.show = function() {
        $scope.isDisplayed = true;
        $timeout($scope.hide, TIMEOUT);
      }

      $scope.hide = function() {
        $scope.isDisplayed = false;
      }
    }
  }
}]);
