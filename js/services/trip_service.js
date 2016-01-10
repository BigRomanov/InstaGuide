app.service('TripService', ['$http', 'Trip', function($http, Trip) {

  this.recommended_locations = [
  {
      name : "Location 1"
    },
    {
      name : "Location 2"
    },
    {
      name : "Location 3"
    },
    {
      name : "Location 4"
    },
    {
      name : "Location 5"
    },
  ];

  this.savedLocations = []; // Collection of locations saved by the user

  this.trips = [];  // Collection of trips which belong to the user
  this.trip = null; // Current trip

  this.init = function() {
    // TODO: Implement this
    console.log("Load data from server...");

    // Trip.query(function(data) {
    //   console.log("Got trips", data);
    //   $scope.trips = data;
    // });

    console.log("Loaded data from server...");
  }

  this.showPlaceOnMap = function(place) {
    console.log("Original showPlaceOnMap", place);
  }

  this.setTrip = function(trip) {
    this.trip = trip;
    return trip;
  }

  this.addTrip = function(trip) {
    if (trip.type == 'vacation') {
      trip.title = 'Vacation in ' + trip.location;
    }
    else if (trip.type == 'trip') {
      trip.title = 'Trip to ' + trip.location;
    }
    else {
      trip.title = 'Night in ' + trip.location;
    }

    trip.places = [];

    this.trips.push(trip);
    this.trip = trip;
  }

  this.deleteTrip = function(trip) {
    console.log('TripService::deleteTrip', trip);
  }

  this.loadRecommendedPlaces = function(trip) {
    // Load recommendations for current trip
  }

  this.addPlace = function(place) {
    console.log("TripService:addPlace", place);
    this.trip.places.push(place);
  }

  this.recommendPlace = function(place, recommendation) {
    console.log("TripService:recommendPlace", place, recommendation);
  }

  this.saveLocation = function(lat, lng) {
    this.lastLocation = {'lat':lat, 'lng' : lng}
  }

  this.getLastLocation = function() {
    return this.lastLocation;
  }



}]);