app.directive("iconDialog", ["ListService", function(ListService) {
  var COLUMNS = 6;

  return {
    restrict: 'E',
    scope: {
      'show': '=',
      'selectedIconId': '=',
      'onCancel': '=',
      'onSave': '='
    },
    templateUrl: '/components/icon-dialog/icon-dialog.html',
    link: function($scope, $elem, $attrs) {
      $scope.icons = [];

      $scope.$watch("selectedIconId", function() {
        initSelectedIcon();
      });

      ListService.getIcons()
      .then(function(icons) {
        $scope.icons = icons;
        $scope.rows = new Array(Math.ceil(icons.length / COLUMNS));
        for (var i=0; i < $scope.rows.length; i++) {
          $scope.rows[i] = icons.slice(i*COLUMNS, (i+1)*COLUMNS);
        }
        initSelectedIcon();
        $scope.$apply();
      })
      .catch(function(err) {
        console.error(err);
        $scope.$apply();
      });

      $scope.chooseIcon = function(icon) {
        $scope.selectedIcon = icon;
      }

      $scope.okay = function() {
        if ($scope.selectedIcon && $scope.onSave) {
          $scope.onSave($scope.selectedIcon);
        }
      }

      $scope.cancel = function() {
        if ($scope.onCancel) {
          $scope.onCancel();
        }
      }

      function initSelectedIcon() {
        if ($scope.selectedIconId && $scope.icons.length) {
          $scope.selectedIcon = $scope.icons.find(function(icon) {
            return icon.id == $scope.selectedIconId;
          });
        }
      }
    }
  }
}]);
