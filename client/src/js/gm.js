function initMap() {
  angular.element(document.body).scope().$root.$broadcast('gm-map-loaded');
}
