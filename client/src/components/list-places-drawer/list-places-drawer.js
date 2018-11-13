app.directive("listPlacesDrawer", function(requirePassword, PlaceService, ImageService, UserService) {
  return {
    restrict: 'E',
    scope: {
      list: '=',
      editMode: '<',
      onClick: '<',
      placeChanged: '<',
      highlightPlace: '<',
      saveList: '<',
      showNewPlaceDialog: '<',
      user: '='
    },
    templateUrl: '/components/list-places-drawer/list-places-drawer.html',
    link: function($scope, $elem, $attrs) {
      $scope.signedInUser = UserService.getUser();

      $scope.test = function() {
        console.log('test');
      }

      $scope.$on('place-changed', function($evt, place) {
      });

      $scope.$on('highlight-place', function($evt, data) {
        var place = data.place;
        if (data.scrollTo) {
          $scope.placeFilter = undefined;
          // scroll to the place on the list
          var li = document.getElementById('place_' + place.id);
          if (li) {
            var placeList = document.getElementById('place-list');
            placeList.scrollTo(0, li.offsetTop);
          }
        }
      });

      $scope.handleCheckboxClick = function(place) {
        requirePassword({
          afterAuthenticate: function() {
            var p = Object.assign({}, place);
            p.gmObject = undefined;
            if (!p.isChecked) {
              p.dateChecked = undefined;
            }
            PlaceService.updateUserPlace($scope.user.id, p)
            .then(function(p) {
              place.dateChecked = p.dateChecked;
              // MapService.updatePlaceOnMap(map, place);
              ClusterService.update(clusterer);
              var action = p.dateChecked ? 'Saved' : 'Removed';
              var reminder = $scope.list.isFollowed ? '' : 'Be sure to follow this list if you want to track your progress.';
              alert(action + " your visit to " + place.placeName + ". " + reminder);
              $scope.$apply();
            })
            .catch(function(err) {
              $scope.$apply();
            });
          }
        });
      }

      $scope.toggleActionsForPlace = function(place) {
        place.actionsAreDisplayed = place.actionsAreDisplayed ? false : true;
      }

      $scope.choosePhotoForPlace = function(place) {
        document.getElementById('photo_upload').click();
        placeForLastPhotoUpload = place;
      }

      $scope.onImageChosen = function(event) {
        if (!placeForLastPhotoUpload) {
          return;
        }

        placeForLastPhotoUpload.isUploadingPhoto = true;

        if (event.target.files && event.target.files.length) {
          var file = event.target.files[0];
          var reader = new FileReader();
          reader.onload = function(event) {
            if (placeForLastPhotoUpload) {
              placeForLastPhotoUpload.img_file = event.target.result;
              ImageService.createThumbnail(placeForLastPhotoUpload.img_file, afterCreateThumbnail.bind(placeForLastPhotoUpload, placeForLastPhotoUpload));
              $scope.$apply();
            }
          };
          reader.readAsDataURL(file);
        }
      }

      function afterCreateThumbnail(place, thumb64) {
        $scope.$apply(function() {
          place.img_file_thumb = thumb64;
          requirePassword({
            afterAuthenticate: function() {
              PlaceService.updateUserPlace($scope.user.id, place)
              .then(function() {
                place.isUploadingPhoto = false;
                place.actionsAreDisplayed = false;
                $scope.$apply();
              })
              .catch(function(err) {
                console.error(err);
                place.isUploadingPhoto = false;
                $scope.$apply();
              });
            }
          });
        });
      }

      $scope.saveUserPlaceDetails = function(place) {
        if (!place.placeDescription) {
          place.actionsAreDisplayed = false;
          return;
        }
        requirePassword({
          afterAuthenticate: function() {
            var _place = Object.assign({}, place);
            delete _place.gmObject;
            PlaceService.updateUserPlace($scope.user.id, _place)
            .then(function() {
              place.isSaving = false;
              place.actionsAreDisplayed = false;
              $scope.$apply();
            })
            .catch(function(err) {
              console.error(err);
              place.isSaving = false;
              $scope.$apply();
            });
          }
        });
      }

    }
  }
});
