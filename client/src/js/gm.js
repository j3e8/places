var MAP_IS_LOADED = false;

function initGoogleMaps() {
  MAP_IS_LOADED = true;
  console.log('initMap');
  if (document.body && window.angular) {
    console.log('document.body loaded');
    var $injector = angular.element(document.body).injector();
    if ($injector && $injector.has('MapService')) {
      console.log('has service');
      angular.element(document.body).scope().$root.$broadcast('gm-map-loaded', 'map loaded');
      console.log('broadcasted');
      return;
    }
  }
  console.warn('angular not ready yet');
  setTimeout(initMap, 10);
}
