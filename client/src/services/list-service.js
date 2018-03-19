app.service("ListService", ["$http", "PLACES_SERVICE_URL", "PlaceService", function($http, PLACES_SERVICE_URL, PlaceService) {
  var ListService = {};

  ListService.ALPHABETICALLY = 0;

  ListService.create = function(list) {
    return new Promise(function(resolve, reject) {
      $http.post(PLACES_SERVICE_URL + '/list', list)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.get = function(listId) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/list/' + listId)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.getIcons = function() {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/icons')
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.getListsCreatedByUser = function(userId) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/user/' + userId + '/lists/created')
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.getListsFollowedByUser = function(userId) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/user/' + userId + '/lists/followed')
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.getListsForPlace = function(placeId) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/lists/?placeId=' + placeId)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.getPopularLists = function() {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/lists/popular')
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.listHasPolylines = function(list) {
    var pl = list.places.find(function(place) {
      return place.shapeType == 'polyline';
    });
    return pl ? true : false;
  }

  ListService.follow = function(userId, listId) {
    return new Promise(function(resolve, reject) {
      $http.post(PLACES_SERVICE_URL + '/user/' + userId + '/list/' + listId)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.search = function(q) {
    return new Promise(function(resolve, reject) {
      $http.get(PLACES_SERVICE_URL + '/lists?search=' + q)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.sortList = function(list, sort) {
    if (!list || !list.places) {
      return;
    }
    if (sort == ListService.ALPHABETICALLY) {
      list.places.sort(function(a, b) {
        if (a.placeName == b.placeName) return 0;
        return a.placeName < b.placeName ? -1 : 1;
      });
    }
  }

  ListService.unfollow = function(userId, listId) {
    return new Promise(function(resolve, reject) {
      $http.delete(PLACES_SERVICE_URL + '/user/' + userId + '/list/' + listId)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.update = function(listId, list) {
    return new Promise(function(resolve, reject) {
      $http.put(PLACES_SERVICE_URL + '/list/' + listId, list)
      .then(function(response) {
        resolve(response.data);
      }, function(err) {
        reject(err);
      });
    });
  }

  ListService.calculateBounds = function(list) {
    var bounds = {};
    list.places.forEach(function(place) {
      var p = PlaceService.calculateBounds(place);
      if (bounds.minLat === undefined || p.minLat < bounds.minLat) bounds.minLat = p.minLat;
      if (bounds.maxLat === undefined || p.maxLat > bounds.maxLat) bounds.maxLat = p.maxLat;
      if (bounds.minLng === undefined || p.minLng < bounds.minLng) bounds.minLng = p.minLng;
      if (bounds.maxLng === undefined || p.maxLng > bounds.maxLng) bounds.maxLng = p.maxLng;
    });
    return bounds;
  }

  return ListService;
}]);
