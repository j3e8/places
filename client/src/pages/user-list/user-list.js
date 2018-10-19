app.controller("userListController", function($scope, $routeParams, MapService, ClusterService, PlaceService, ListService, UserService, alert, $timeout, $location, requirePassword, HOST, ImageService) {
  var placeForLastPhotoUpload;

  $scope.activeDrawer = 1;

  $scope.placeDialogIsDisplayed = undefined;
  $scope.signedInUser = UserService.getUser();
  $scope.editMode = false;

  var userId = $routeParams.userId || $scope.signedInUser.id;

  if ($routeParams.listId) {
    loadList();
  }
  else {
    $scope.editMode = true;
  }

  UserService.getUserById(userId)
  .then(function(u) {
    $scope.user = u;
    $scope.$apply();
  })
  .catch(function(e) { });

  function loadList() {
    ListService.getListForUser($routeParams.listId, userId)
    .then(function(list) {
      $scope.list = list;
      if ($scope.list.creatorUserId == $scope.signedInUser.id) {
        $scope.editMode = true;
      }
      ListService.sortList($scope.list, ListService.ALPHABETICALLY);
      $scope.$apply();
    })
    .catch(function(err) {
      console.error("Couldn't load list", err);
      $scope.$apply();
    });
  }

  if ($scope.signedInUser && $routeParams.userId == $scope.signedInUser.id) {
    ListService.markListAsRecentlyViewed($routeParams.listId)
    .catch(function(err) { });
  }

  $scope.highlightPlace = function(place, zoomTo, scrollTo) {
    $scope.unhighlightAllPlaces();
    place.highlighted = true;
    $scope.$broadcast('highlight-place', { place: place, zoomTo: zoomTo, scrollTo: scrollTo });
  }

  $scope.placeChanged = function(place) {
    $scope.$broadcast('place-changed', place);
  }

  $scope.unhighlightAllPlaces = function() {
    $scope.list.places.forEach(function(place) {
      place.highlighted = false;
    });
  }

  $scope.setActiveDrawer = function(num) {
    if ($scope.activeDrawer == num) {
      $scope.activeDrawer = num - 1;
    }
    else {
      $scope.activeDrawer = num || 1;
    }
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

});
