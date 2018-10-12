app.directive("listInfoDrawer", function(requirePassword, ListService, HOST) {
  return {
    restrict: 'E',
    scope: {
      list: '=',
      onClick: '<',
      placeChanged: '<',
      highlightPlace: '<',
      user: '='
    },
    templateUrl: '/components/list-info-drawer/list-info-drawer.html',
    link: function($scope, $elem, $attrs) {

      $scope.followList = function() {
        if (!$scope.user || !$scope.user.id) {
          return;
        }
        requirePassword({
          afterAuthenticate: function() {
            ListService.follow($scope.signedInUser.id, $scope.list.id)
            .then(function() {
              $location.path('/list/' + $scope.list.id);
              $scope.$apply();
            })
            .catch(function(err) {
              console.error(err);
              $scope.$apply();
            });
          }
        });
      }

      $scope.toggleShareableLink = function() {
        $scope.shareableLinkIsDisplayed = $scope.shareableLinkIsDisplayed ? false : true;
        if ($scope.shareableLinkIsDisplayed) {
          $timeout(function() {
            try {
              var el = document.getElementById('shareable-link');
              el.select();
              document.execCommand('copy');
              alert("Copied link to clipboard");
            } catch(ex) {
              console.error(ex);
            }
          }, 10);
        }
      }

      $scope.getShareableLink = function() {
        if (!$scope.list || !$scope.user) {
          return '';
        }
        return HOST + '/list/' + $scope.list.id + "/user/" + $scope.user.id;
      }


    }
  }
});
