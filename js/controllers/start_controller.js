MyGuideApp.controller('StartController', ['$scope', '$timeout' ,'$window', '$location', 'TripService', 
  function ($scope, $timeout, $window, $location, TripService) {

    $scope.createTrip = function() {
      TripService.addTrip($scope.newtrip);

      $scope.trips = TripService.trips;
      $scope.trip = TripService.trip;

      $location.path('plan');
    }

    $scope.init = function() {
      $scope.newtrip = {
        name: '',
        type: "vacation",
        from: new Date(),
        on: new Date(),
        location: ''
      }

      
      $scope.first_trip = (TripService.trips.length == 0);
    }

    $scope.init();

  }]);