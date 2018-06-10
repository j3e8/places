app.directive('waitIndicator', [function() {
  return {
    scope: {
      color: '@',
      size: '@'
    },
    templateUrl: '/components/wait-indicator/wait-indicator.html'
  }
}]);
