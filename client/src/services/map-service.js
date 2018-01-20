app.service("MapService", ["$rootScope", function($rootScope) {
  var MapService = {
    loaded: false
  };
  var subscribers = [];

  console.log('MapService loaded');

  if (window.MAP_IS_LOADED) {
    handleMapLoaded();
  }

  $rootScope.$on("gm-map-loaded", function($event, data) {
    handleMapLoaded();
  });

  function handleMapLoaded() {
    console.log('map loaded broadcast received');
    MapService.loaded = true;
    var subs = subscribers.splice(0, subscribers.length);
    subs.forEach(function(s) {
      s();
    });
  }

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
