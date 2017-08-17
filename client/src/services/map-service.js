app.service("MapService", ["$rootScope", function($rootScope) {
  var MapService = {
    loaded: false
  };
  var subscribers = [];

  $rootScope.$on("gm-map-loaded", function($event, data) {
    console.log('map loaded');
    MapService.loaded = true;
    var subs = subscribers.splice(0, subscribers.length);
    subs.forEach(function(s) {
      s();
    });
  });

  MapService.load = function() {
    if (MapService.loaded) {
      return Promise.resolve();
    }
    return new Promise(function(resolve, reject) {
      subscribers.push(resolve);
    });
  }

  return MapService;
}]);
