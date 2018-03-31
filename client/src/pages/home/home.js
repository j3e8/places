app.controller("homeController", ["$scope", "PlaceService", "UserService", "ListService", "$location", function($scope, PlaceService, UserService, ListService, $location) {
  $scope.user = UserService.getUser();
  $scope.userPlaces = [];
  $scope.followedLists = [];

  ListService.getListsFollowedByUser($scope.user.id)
  .then(function(lists) {
    $scope.completedLists = lists.filter(function(l) { return l.numberOfPlaces == l.numberOfVisited; });
    $scope.followedLists = lists.filter(function(l) { return l.numberOfPlaces != l.numberOfVisited; });
    $scope.$apply();
  })
  .catch(function(err) {
    console.error("Couldn't load followed lists", err);
    $scope.$apply();
  });

  PlaceService.getRecentPlacesForUsersNetwork($scope.user.id)
  .then(function(userPlaces) {
    $scope.userPlaces = [];
    userPlaces.forEach(function(up) {
      var p = getPlaceFromObject(up);
      var u = getUserFromObject(up);
      u.dateChecked = p.dateChecked;

      if (!$scope.userPlaces.length) {
        $scope.userPlaces.push(u);
        u.places.push(p);
      }
      else {
        var lastUser = $scope.userPlaces[$scope.userPlaces.length-1];
        if (areDatesEqual(lastUser.dateChecked, p.dateChecked)) {
          lastUser.places.push(p);
        }
        else {
          $scope.userPlaces.push(u);
          u.places.push(p);
        }
      }
    });
    $scope.$apply();
  })
  .catch(function(err) {
    console.error("Couldn't load places", err);
    $scope.$apply();
  });

  var userFields = [ 'username', 'userId', 'imgUrl' ];

  function getPlaceFromObject(userPlace) {
    var place = {};
    for (var prop in userPlace) {
      if (userFields.indexOf(prop) == -1) {
        place[prop] = userPlace[prop];
      }
    }
    return place;
  }

  function getUserFromObject(userPlace) {
    var user = {
      places: []
    };
    for (var prop in userPlace) {
      if (userFields.indexOf(prop) != -1) {
        user[prop] = userPlace[prop];
      }
    }
    return user;
  }

  function makeDateFromDateTimeString(str) {
    var d = new Date(Date.parse(str));
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function areDatesEqual(dateStringA, dateStringB) {
    var a = new Date(Date.parse(dateStringA));
    var b = new Date(Date.parse(dateStringB));
    if (a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate()) {
      return true;
    }
    return false;
  }
}]);
