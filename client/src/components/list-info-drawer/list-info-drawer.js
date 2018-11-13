app.directive("listInfoDrawer", function($timeout, alert, requirePassword, ListService, UserService, HOST) {
  return {
    restrict: 'E',
    scope: {
      list: '=',
      editMode: '<',
      onClick: '<',
      placeChanged: '<',
      highlightPlace: '<',
      saveList: '<',
      user: '='
    },
    templateUrl: '/components/list-info-drawer/list-info-drawer.html',
    link: function($scope, $elem, $attrs) {
      $scope.signedInUser = UserService.getUser();

      $scope.editing = {};

      $scope.$watch('list', function() {
        // if the $scope property 'list' has been set, but there isn't an id, we know it's a new list being created
        if ($scope.list && !$scope.list.id) {
          $scope.editing = {
            'listName': true
          }

          // load the default icon
          ListService.getDefaultIcon()
          .then(function(icon) {
            $scope.list.iconId = icon.id;
            $scope.list.iconUrl = icon.iconUrl;
            $scope.$apply();
          })
          .catch(function(err) {
            alert("There was a problem loading the icon for the list", true);
            $scope.$apply();
          });


        }
      });

      $scope.followList = function() {
        if (!$scope.user || !$scope.user.id) {
          return;
        }
        requirePassword({
          afterAuthenticate: function() {
            ListService.follow($scope.signedInUser.id, $scope.list.id)
            .then(function() {
              $scope.list.isFollowed = true;
              $scope.$apply();
            })
            .catch(function(err) {
              console.error(err);
              $scope.$apply();
            });
          }
        });
      }

      $scope.unfollowList = function() {
        if (!$scope.user || !$scope.user.id) {
          return;
        }
        requirePassword({
          afterAuthenticate: function() {
            ListService.unfollow($scope.signedInUser.id, $scope.list.id)
            .then(function() {
              $scope.list.isFollowed = false;
              $scope.$apply();
            })
            .catch(function(err) {
              console.error(err);
              $scope.$apply();
            });
          }
        });
      }

      $scope.toggleEditField = function(fieldName) {
        $scope.editing[fieldName] = $scope.editing[fieldName] ? false : true;
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

      $scope.chooseIcon = function() {
        if ($scope.editMode) {
          $scope.iconDialogIsDisplayed = true;
        }
      }

      $scope.save = function() {
        $scope.saveList()
        .then(function() {
          $scope.editing = {};
        });
      }

      $scope.updateIcon = function(icon) {
        $scope.list.iconId = icon.id;
        $scope.list.iconUrl = icon.iconUrl;
        $scope.iconDialogIsDisplayed = false;
        $scope.save();
      }

      $scope.closeIconDialog = function() {
        $scope.iconDialogIsDisplayed = false;
      }

      $scope.updateAdminFlag = function() {
        $scope.save();
      }

      $scope.cancelList = function() {
        $location.path('/home');
      }

    }
  }
});
