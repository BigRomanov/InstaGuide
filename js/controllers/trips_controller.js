MyGuideApp.controller('TripsController', ['$scope', '$timeout' ,'$window', '$location', 'TripService',
  function ($scope, $timeout, $window, $location, TripService) {

    $scope.deleteTrip = function(trip) {
      TripService.deleteTrip(trip, function(trips) {
        $scope.trips = trips;
      });
    }

    $scope.planTrip = function(trip) {
      TripService.trip = trip;
    }

    $scope.createTrip = function() {
      $location.path('start');
    }

    $scope.init = function() {
      
      TripService.init();
      
      $scope.recommended_locations = TripService.recommended_locations;      
      $scope.trips = TripService.trips;
      $scope.trip  = TripService.trip;

      //$scope.loading = true;
      // $scope.timeout = $timeout(function() {
      //   $scope.trips = [
      //   {
      //     "name": "Vacation in Goa",
      //     "places" : [{}, {}, {}, {}]
      //   },
      //   {
      //     "name": "Vacation in Berlin",
      //     "places" : [{}, {}, {}, {}]
      //   },
      //   {
      //     "name": "Vacation in Prague",
      //     "places" : [{}, {}, {}, {}]
      //   },
      //   {
      //     "name": "Vacation in Belgium",
      //     "places" : [{}, {}, {}, {}]
      //   },
      //   {
      //     "name": "Vacation in Tel Aviv",
      //     "places" : [{}, {}, {}, {}]
      //   },
      //];
      //$scope.loading = false;
      //}, 2000);
      
    }

    $scope.viewTrips = function() {
      $scope.pane_view = 'trips';
    }

    $scope.viewPlaces = function() {
      $scope.item_view = 'recommended';
    }

    $scope.viewRecommended = function() {
      $scope.item_view = 'recommended';
    }

    $scope.viewSelected = function() {
      $scope.item_view = 'selected';
    }

    $scope.setTrip = function(trip) {
      $scope.trip = TripService.setTrip(trip);
      $scope.pane_view = 'trip';
      $scope.viewRecommended(); //TBD: Or view selected
    }

    $scope.addNewPlaceAction = function() {
      console.log("Add new place action");
      $scope.view = 'addnew';
    }

    $scope.init();

}]);