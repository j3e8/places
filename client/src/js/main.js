var app = angular.module("mainApp", ['ngAnimate', 'ngRoute', 'ngSanitize', 'app.config']);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true, requireBase: false });

  $routeProvider
  .when('/', {
    templateUrl: '/pages/signup/signup.html',
    controller: 'signupController'
  })
  .when('/admin', {
    templateUrl: '/pages/admin/dashboard/dashboard.html',
    controller: 'adminDashboardController'
  })
  .when('/created-lists', {
    templateUrl: '/pages/created-lists/created-lists.html',
    controller: 'createdListsController'
  })
  .when('/followed-lists', {
    templateUrl: '/pages/followed-lists/followed-lists.html',
    controller: 'followedListsController'
  })
  .when('/home', {
    templateUrl: '/pages/home/home.html',
    controller: 'homeController'
  })
  .when('/lists', {
    templateUrl: '/pages/lists/lists.html',
    controller: 'listsController'
  })
  .when('/list/new', {
    templateUrl: '/pages/user-list/user-list.html',
    controller: 'userListController'
  })
  .when('/list/:listId/edit', {
    templateUrl: '/pages/user-list/user-list.html',
    controller: 'userListController'
  })
  .when('/list/:listId', {
    templateUrl: '/pages/user-list/user-list.html',
    controller: 'userListController'
  })
  .when('/list/:listId/user/:userId', {
    templateUrl: '/pages/user-list/user-list.html',
    controller: 'userListController'
  })
  .when('/places', {
    templateUrl: '/pages/places/places.html',
    controller: 'placesController'
  })
  .when('/place/:placeId', {
    templateUrl: '/pages/place/place.html',
    controller: 'placeController'
  })
  .when('/privacy', {
    templateUrl: '/pages/privacy/privacy.html',
    controller: 'privacyController'
  })
  .when('/profile', {
    templateUrl: '/pages/profile/profile.html',
    controller: 'profileController'
  })
  .when('/search', {
    templateUrl: '/pages/search/search.html',
    controller: 'searchController'
  })
  .when('/signin', {
    templateUrl: '/pages/signin/signin.html',
    controller: 'signinController'
  })
  .when('/signup', {
    templateUrl: '/pages/signup/signup.html',
    controller: 'signupController'
  })
  .when('/terms', {
    templateUrl: '/pages/terms/terms.html',
    controller: 'termsController'
  })
  .when('/user/:userId', {
    templateUrl: '/pages/user/user.html',
    controller: 'userController'
  })
}])
.run(function($rootScope, $route, $location){
  $rootScope.$on('$routeChangeSuccess', function(e,to){
    window.scrollTo(0, 0);
  });

  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    try {
      var path = next.substring(next.indexOf('/', next.indexOf('//') + 2));
      if (path == '/' && localStorage.getItem('user')) {
        $location.path('/home');
      }
      else if (path == '/' && localStorage.getItem('hasEverSignedIn')) {
        $location.path('/signin');
      }
    } catch(ex) { }
  });
});
