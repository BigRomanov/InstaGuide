app.controller('PlacesController', ['$scope', '$timeout' ,'$window', '$location', '$routeParams', 'TripService',
  function ($scope, $timeout, $window, $location, $routeParams, TripService) {

    $scope.init = function() {

      console.log("PlacesController", $routeParams);

      if ($routeParams.view == "recommended") {
        $scope.selectedView = 0;
      }
      if ($routeParams.view == "selected") {
        $scope.selectedView = 1;
      }
      if ($routeParams.view == "discover") {
        $scope.selectedView = 2;
      }
      else {
        $scope.selectedView = 0;
      }
      
      TripService.init();
      
      $scope.recommended_locations = TripService.recommended_locations;      
      $scope.trips = TripService.trips;
      $scope.trip  = TripService.trip;
    }


    // $scope.viewPlaces = function() {
    //   $scope.item_view = 'recommended';
    // }

    // $scope.viewRecommended = function() {
    //   $scope.item_view = 'recommended';
    // }

    // $scope.viewSelected = function() {
    //   $scope.item_view = 'selected';
    // }

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