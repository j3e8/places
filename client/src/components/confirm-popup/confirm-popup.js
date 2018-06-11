app.directive("confirmPopup", ["$rootScope", "$timeout", function($rootScope, $timeout) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/components/confirm-popup/confirm-popup.html',
    link: function($scope, $elem, $attrs) {
      $scope.message = '';
      $scope.isWarning = false;
      $scope.isDisplayed = undefined;

      $rootScope.$on('confirm', function(event, data) {
        $scope.message = data.message;
        $scope.onOk = data.ok;
        $scope.onCancel = data.cancel;
        $scope.isWarning = data.isWarning ? true : false;
        $scope.show();
      });

      $scope.show = function() {
        $scope.isDisplayed = true;
      }

      $scope.hide = function() {
        $scope.isDisplayed = false;
      }

      $scope.okay = function() {
        if ($scope.onOk) {
          $scope.onOk();
          $scope.hide();
        }
      }

      $scope.cancel = function() {
        if ($scope.onCancel) {
          $scope.onCancel();
        }
        $scope.hide();
      }

    }
  }
}]);
