app.controller("editListController", ["$scope", "$routeParams", "UserService", "MapService", "ClusterService", "PlaceService", "ListService", "alert", "$timeout", "$location", "requirePassword", "HOST", "ImageService", "confirm",
function($scope, $routeParams, UserService, MapService, ClusterService, PlaceService, ListService, alert, $timeout, $location, requirePassword, HOST, ImageService, confirm) {
  $scope.user = UserService.getUser();
  $scope.newPlaceDialogIsDisplayed = undefined;
  $scope.list = {
    places: []
  };
  $scope.editing = {};
  $scope.editMode = false;

  var map, clusterer;

  var DEFAULT_COORDS = { lat: 39.5464, lng: -97.3296 };
  var DEFAULT_ZOOM = 4;
  var SPECIFIC_ZOOM = 7;
  var shapeList = [];

  $scope.centerCoords = DEFAULT_COORDS;

  MapService.load()
  .then(function() {
    initMap();
    clusterer = ClusterService.createClusterer(map, $scope.placeClicked);
    if ($routeParams.listId) {
      loadList($routeParams.listId);
    }
    else {
      $scope.editMode = true;
      $scope.editing = {
        'listName': true
      }
      $scope.list.listName = 'Untitled List';
    }
  })
  .catch(function(err) {
    console.error(err);
  });

  if (!$routeParams.listId) {
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

  function loadList(listId) {
    ListService.get(listId)
    .then(function(list) {
      $scope.list = list;
      $scope.editMode = $scope.list.creatorUserId == $scope.user.id ? true : false;
      var listBounds = ListService.calculateBounds($scope.list);
      MapService.setMapToContainList(map, listBounds);
      $scope.list.places.forEach(function(place) {
        ClusterService.addPlaceToClusterer(clusterer, place);
      });
      $timeout(function() {
        ClusterService.update(clusterer);
      });
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load list", err);
      $scope.$apply();
    });
  }

  $scope.toggleEditField = function(fieldName) {
    $scope.editing[fieldName] = $scope.editing[fieldName] ? false : true;
  }

  $scope.placeClicked = function(gmEvent) {
    var gmObject = this;
    $scope.unhighlightAllPlaces();
    $scope.placeFilter = undefined;

    var clickedPlace = $scope.list.places.find(function(place) {
      return place.id == gmObject.shapeId;
    });

    if (clickedPlace) {
      clickedPlace.highlighted = true;
      ClusterService.update(clusterer);
      // MapService.updatePlaceOnMap(map, clickedPlace);

      // scroll to the place on the list
      var li = document.getElementById('place_' + clickedPlace.id);
      if (li) {
        var placeList = document.getElementById('place-list');
        placeList.scrollTo(0, li.offsetTop);
      }
    }
    $scope.$apply();
  }

  $scope.highlightPlace = function(place) {
    $scope.unhighlightAllPlaces();
    place.highlighted = true;
    ClusterService.update(clusterer);
    // MapService.updatePlaceOnMap(map, place);
    MapService.zoomToPlace(map, place);
  }

  $scope.unhighlightAllPlaces = function() {
    $scope.list.places.forEach(function(place) {
      place.highlighted = false;
      // MapService.updatePlaceOnMap(map, place);
    });
    ClusterService.update(clusterer);
  }

  $scope.showNewPlaceDialog = function() {
    requirePassword({
      afterAuthenticate: function() {
        var latlng = map.getCenter();
        $scope.centerCoords = { lat: latlng.lat(), lng: latlng.lng() };
        $scope.zoom = map.getZoom();
        $scope.placeToEditId = null;
        $scope.newPlaceDialogIsDisplayed = true;
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

  $scope.handleFollowChange = function() {
    if (!$scope.user || !$scope.user.id) {
      return;
    }
    requirePassword({
      afterAuthenticate: function() {
        $scope.list.isFollowed = !$scope.list.isFollowed;
        if ($scope.list.isFollowed) {
          ListService.follow($scope.user.id, $scope.list.id)
          .then(function() {
            $scope.list.numberOfFollowers++;
            $scope.$apply();
          })
          .catch(function(err) {
            console.error(err);
            $scope.$apply();
          });
        }
        else {
          ListService.unfollow($scope.user.id, $scope.list.id)
          .then(function() {
            $scope.list.numberOfFollowers--;
            $scope.$apply();
          })
          .catch(function(err) {
            console.error(err);
            $scope.$apply();
          });
        }
      }
    });
  }

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

  $scope.chooseIcon = function() {
    if ($scope.editMode) {
      $scope.iconDialogIsDisplayed = true;
    }
  }

  $scope.updateIcon = function(icon) {
    $scope.list.iconId = icon.id;
    $scope.list.iconUrl = icon.iconUrl;
    $scope.iconDialogIsDisplayed = false;
    $scope.saveList();
  }

  $scope.closeIconDialog = function() {
    $scope.iconDialogIsDisplayed = false;
  }

  $scope.updateAdminFlag = function() {
    requirePassword({
      afterAuthenticate: $scope.saveList
    });
  }

  $scope.editPlace = function(place) {
    requirePassword({
      afterAuthenticate: function() {
        $scope.placeToEditId = place.id;
        $scope.newPlaceDialogIsDisplayed = true;
      }
    });
  }

  $scope.afterPlaceSave = function(place) {
    $scope.closeNewPlaceDialog();
    $scope.addPlaceToList(place);
    $scope.saveList();
  }

  $scope.handlePlaceResultClick = function(place) {
    $scope.addPlaceToList(place);
    $scope.placeFilter = undefined;
  }

  $scope.addPlaceToList = function(place) {
    var existing = $scope.list.places.find(function(p) { return p.id == place.id; });
    if (existing) {
      // existing.gmObject.setMap(null);
      $scope.list.places.splice($scope.list.places.indexOf(existing), 1, place);
    }
    else {
      $scope.list.places.push(place);
    }
    ClusterService.addPlaceToClusterer(clusterer, place);
    ClusterService.update(clusterer);
  }

  $scope.removePlace = function(place) {
    confirm("Are you sure you want to remove " + place.placeName + " from this list?", function() {
      $scope.saveList();
      $scope.list.places.splice($scope.list.places.indexOf(place), 1);
      ClusterService.removePlaceFromClusterer(clusterer, place);
      ClusterService.update(clusterer);
    });
  }

  $scope.closeNewPlaceDialog = function() {
    $scope.placeToEditId = null;
    $scope.newPlaceDialogIsDisplayed = false;
  }

  $scope.saveList = function() {
    if (!$scope.list.listName) {
      alert("You must provide a list name in order to save your list", true);
      return;
    }
    requirePassword({
      afterAuthenticate: function() {
        $scope.isSaving = true;
        createOrUpdate()
        .then(function(list) {
          $scope.isSaving = false;
          if (list.id && !$scope.list.id) {
            $location.path('/list/' + list.id + '/edit');
          }
          else {
            $scope.list = list;
          }
          $scope.editing = {};
          alert("List saved");
          $scope.$apply();
        })
        .catch(function(error) {
          $scope.isSaving = false;
          alert("There was a problem saving your list. Try again later.", true);
          console.error(error);
          $scope.$apply();
        });
      }
    });
  }

  $scope.cancelList = function() {
    $location.path('/home');
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
        PlaceService.updateUserPlace($scope.user.id, place)
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

  function createOrUpdate() {
    var list = Object.assign({}, $scope.list);
    list.places = list.places.map(function(place) {
      return { id: place.id };
    });
    if ($scope.list.id) {
      return ListService.update(list.id, list);
    }
    else {
      return ListService.create(list)
      .then(function(l) {
        list = l;
        return ListService.follow($scope.user.id, list.id);
      })
      .then(function() { return Promise.resolve(list) });
    }
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('list-map'), {
      zoom: DEFAULT_ZOOM,
      center: new google.maps.LatLng($scope.centerCoords),
      mapTypeId: 'roadmap',
      gestureHandling: 'greedy'
    });
    map.setOptions({ styles: CUSTOM_MAP_STYLES });
    google.maps.event.addListener(map, "click", mapClick);
  }

  function mapClick() {
    $scope.unhighlightAllPlaces();
    $scope.$apply();
  }

}]);
