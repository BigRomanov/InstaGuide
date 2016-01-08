var MyGuideApp = angular.module('MyGuideApp', ['ngRoute', 'ngResource', 'ngSanitize', 'ngMaterial']);

MyGuideApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider.
    when('/discover/:location?', {
      templateUrl: 'partials/discover.html',
      controller: 'DiscoverController'
    }).
    when('/token', {
      templateUrl: 'partials/admin.html',
      controller: 'InstagramTokenController'
    }).
    otherwise({
      redirectTo: '/discover'
    });

    $httpProvider.interceptors.push('AuthTokenInterceptor');
  }
]);

MyGuideApp.run(['$location', '$rootScope', 'TripService', function($location, $rootScope, TripService) {
  // $rootScope.$on('$routeChangeStart', function (event, current, previous) {
  //     // In case user does not have any trips yet, redirect to start page  
  //     if (current.$$route.originalPath != "/start" && TripService.trips.length == 0) {
  //       console.log("Redirect to start");
  //       event.preventDefault();
  //       $location.path('start');
  //     }
  // });    
}]);

MyGuideApp.controller('HeaderController', function($scope, $location) {
  console.log("Current location:", $location.path());
  // $scope.selectedIndex = 0;

  // if (($location.path().indexOf('places') > -1) || ($location.path().indexOf('trips') > -1) || ($location.path().indexOf('community') > -1)) {
    // if ($location.path().indexOf('places') > -1) {
    //   $scope.selectedIndex = 1;
    // }

    $scope.$watch('selectedTab', function(current, old) {
      console.log("Detected change in selectedTab", current, old);
      switch (current) {
        case 0:
          $location.url("/trips");
          break;
        case 1:
          $location.url("/places");
          break;
        case 2:
          $location.url("/community");
          break;
      }
    });
  // }
});