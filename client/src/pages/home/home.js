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

  Promise.all([
    PlaceService.getRecentPlacesForUsersNetwork($scope.user.id),
    ListService.getRecentListsForUsersNetwork($scope.user.id)
  ])
  .then(function(results) {
    var userPlaces = results[0];
    var userLists = results[1];

    $scope.userPlaces = formatUserPlaces(userPlaces);
    $scope.userLists = formatUserLists(userLists);

    $scope.activities = [].concat($scope.userPlaces, $scope.userLists);
    $scope.activities.sort(function(a, b) {
      var dateA = a.activityType == 'userPlace' ? a.dateChecked : a.dateFollowed;
      var dateB = b.activityType == 'userPlace' ? b.dateChecked : b.dateFollowed;
      return Date.parse(dateA) - Date.parse(dateB);
    });
    $scope.$apply();
  })
  .catch(function(err) {
    console.error("Couldn't load recent activity", err);
    $scope.$apply();
  });

  function formatUserPlaces(userPlaces) {
    var results = [];
    userPlaces.forEach(function(up) {
      var p = getPlaceFromObject(up);
      var u = getUserFromObject(up);
      u.dateChecked = p.dateChecked;
      u.activityType = 'userPlace';

      if (!results.length) {
        results.push(u);
        u.places.push(p);
      }
      else {
        var lastUser = results[results.length-1];
        if (areDatesEqual(lastUser.dateChecked, p.dateChecked)) {
          lastUser.places.push(p);
        }
        else {
          results.push(u);
          u.places.push(p);
        }
      }
    });
    return results;
  }

  function formatUserLists(userLists) {
    var results = [];
    userLists.forEach(function(ul) {
      var l = getListFromObject(ul);
      var u = getUserFromObject(ul);
      u.dateFollowed = l.dateFollowed;
      u.activityType = 'userList';

      if (!results.length) {
        results.push(u);
        u.lists.push(l);
      }
      else {
        var lastUser = results[results.length-1];
        if (areDatesEqual(lastUser.dateFollowed, l.dateFollowed)) {
          lastUser.lists.push(l);
        }
        else {
          results.push(u);
          u.lists.push(l);
        }
      }
    });
    return results;
  }

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

  function getListFromObject(userList) {
    var list = {};
    for (var prop in userList) {
      if (userFields.indexOf(prop) == -1) {
        list[prop] = userList[prop];
      }
    }
    return list;
  }

  function getUserFromObject(userPlace) {
    var user = {
      places: [],
      lists: []
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
