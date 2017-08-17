var app = angular.module("mainApp", ['ngAnimate', 'ngRoute', 'ngSanitize', 'app.config']);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true, requireBase: false });

  $routeProvider
  .when('/', {
    templateUrl: '/pages/home/home.html',
    controller: 'homeController'
  })
  .when('/admin', {
    templateUrl: '/pages/admin/dashboard/dashboard.html',
    controller: 'adminDashboardController'
  })
  .when('/list', {
    templateUrl: '/pages/list/list.html',
    controller: 'listController'
  })
  .when('/list/:listId', {
    templateUrl: '/pages/list/list.html',
    controller: 'listController'
  })
  .when('/signin', {
    templateUrl: '/pages/signin/signin.html',
    controller: 'signinController'
  })
  .when('/signup', {
    templateUrl: '/pages/signup/signup.html',
    controller: 'signupController'
  })
}])
.run(function($rootScope, $route){
  $rootScope.$on('$routeChangeSuccess', function(e,to){
    window.scrollTo(0, 0);
  })
});
