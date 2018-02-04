var app = angular.module("mainApp", ['ngAnimate', 'ngRoute', 'ngSanitize', 'app.config']);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true, requireBase: false });

  $routeProvider
  .when('/', {
    templateUrl: '/pages/signin/signin.html',
    controller: 'signinController'
  })
  .when('/created-lists', {
    templateUrl: '/pages/created-lists/created-lists.html',
    controller: 'createdListsController'
  })
  .when('/home', {
    templateUrl: '/pages/home/home.html',
    controller: 'homeController'
  })
  .when('/lists', {
    templateUrl: '/pages/lists/lists.html',
    controller: 'listsController'
  })
  .when('/admin', {
    templateUrl: '/pages/admin/dashboard/dashboard.html',
    controller: 'adminDashboardController'
  })
  .when('/list/new', {
    templateUrl: '/pages/edit-list/edit-list.html',
    controller: 'editListController'
  })
  .when('/list/:listId/edit', {
    templateUrl: '/pages/edit-list/edit-list.html',
    controller: 'editListController'
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
  });
});
