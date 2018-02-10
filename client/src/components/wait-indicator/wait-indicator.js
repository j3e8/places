app.directive('waitIndicator', [function() {
  return {
    scope: {
      color: '@'
    },
    templateUrl: '/components/wait-indicator/wait-indicator.html'
  }
}]);
