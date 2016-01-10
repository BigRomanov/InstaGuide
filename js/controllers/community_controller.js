app.controller('CommunityController', ['$scope', '$timeout' ,'$window', '$location', 'TripService',
  function ($scope, $timeout, $window, $location, TripService) {

    $scope.trip = null;

    $scope.init = function() {
      $scope.trip = TripService.currentTrip ? TripService.currentTrip : {
        'name' : 'Some default trip name'
      };
    }

    $scope.recommendPlaceAction = function(place) {
      console.log("Add new place action");
      $scope.view = 'addnew';
    }

    $scope.init();

  }]);