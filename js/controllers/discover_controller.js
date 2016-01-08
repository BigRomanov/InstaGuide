MyGuideApp.controller('DiscoverController', ['$scope', '$timeout' ,'$window', '$location', '$routeParams', 'TripService', 'InstagramService', 'GoogleService', 'FlickrService',
  function ($scope, $timeout, $window, $location, $routeParams, TripService, InstagramService, GoogleService, FlickrService) {

  var googlePlacesService;

  // Instagram vars
  var access_token;


  // Data models
  $scope.instagramPhotos = [];
  $scope.flickrPhotos    = [];
  $scope.googlePlaces    = [];

  $scope.photosLoading = false;
  $scope.flickrPhotosLoading = false;
  $scope.placesLoading = false;

  $scope.showResults     = false;
  $scope.showPredictions = false;

  $scope.activeTab = 'photos';


  // Method to extract the instgram access token from url
  $scope.getAccessToken = function(url) {
    var t = url;
    var r = t.replace(/.*access_token=/, '');
    console.log(r);
    return r;
  }

  $scope.instagramAvailable = function() {
    return InstagramService.available();
  }

  $scope.connectToInstagram = function() {
    var client_id = "cb524b4cb7ee4ccfb04c319c721ec59c";
    window.location.assign("https://instagram.com/oauth/authorize/?client_id=cb524b4cb7ee4ccfb04c319c721ec59c&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Ftoken?&response_type=token");    
  }
  
  $scope.init = function () {

    console.log($location.path());
    console.log($routeParams.location);

    // Initialize google places service, with div for attributions
    googlePlacesService = new google.maps.places.PlacesService($("#attributions").get(0));
    GoogleService.setService(googlePlacesService);

    if ($routeParams.location) {
      GoogleService.findPlacesByName($routeParams.location, function(predictions, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          console.log(status);
          return;
        }

        console.log("Loaded " + predictions.length + " predictions", predictions);
        $scope.predictions = predictions;
        $scope.showPredictions = true;
        $scope.$apply();
      });
    }
    else if (TripService.getLastLocation()) {
      var lastLocation = TripService.getLastLocation();
      $scope.onMapClick(lastLocation.lat, lastLocation.lng);
    }
    else if (TripService.trip) {
      $timeout(function () {
        var trip_location = TripService.trip.location;
        console.log("Discover locations around:", trip_location);
        $scope.mapInterface.showAddressOnMap(trip_location);

        // Get the geocoder resolution of the location and simulate map click
        //GoogleService.findPlacesByName(trip_location, function(places) {
          // TODO: Convert to geography to reflect on map
        //});  
      });
    }

    // Initialize TripService with methods from the Google map directive interface
    // This is necessary to allow communication between galeries and map directives
    TripService.showPlaceOnMap = function(place) {
      console.log("TripService.showPlaceOnMap", place);
      $scope.mapInterface.showPlaceOnMap(place);
    }

    TripService.showAddressOnMap = function(address) {
      console.log("TripService.showAddressOnMap", address);
      $scope.mapInterface.showAddressOnMap(address);
    }

    TripService.showLocationOnMap = function(lat,lng) {
      console.log("TripService.showLocationOnMap", lat, lng);
      $scope.mapInterface.showLocationOnMap(lat,lng);
    }

    TripService.clearMarkers = function() {
      console.log("TripService.clearMarkers");
      $scope.mapInterface.clearMarkers();
    }

    TripService.resetMarkers = function() {
      console.log("TripService.resetMarkers");
      $scope.mapInterface.resetMarkers();
    }
  }

  $scope.showAddressOnMap = function(address) {
    console.log("showAddressOnMap", address);
    $scope.mapInterface.showAddressOnMap(address);
  }

  // Callback from map directive which assigns map interface for future use
  $scope.mapCallback = function(interface){
    $scope.mapInterface = interface;
  }

  // Hanndles click on map and loads information regarding the clicked location
  $scope.onMapClick = function(lat, lng) {
    console.log("Map clicked", lat, lng);
    if (!lat || !lng) return;
    
    $scope.showPredictions = false;
    $scope.showResults = true;

    // Save clicked location until the next click
    TripService.saveLocation(lat, lng);

    var distance = 10;

    $scope.photosLoading = true;
    $scope.flickrPhotosLoading = true;
    $scope.placesLoading = true;

    if (InstagramService.available()) {
      InstagramService.getImagesByLatLng(lat, lng, distance, function(photos) {
        $scope.photosLoading = false;
        $scope.instagramPhotos = photos;

        console.log("Instagram photos", $scope.instagramPhotos);
      });
    }

    FlickrService.getImagesByLatLng(lat, lng, function(photos) {
      console.log("Flickr photos", photos);
      $scope.flickrPhotosLoading = false;
      $scope.flickrPhotos = photos;
    });

    GoogleService.getPlacesByLatLng(lat, lng, distance, function(places) {
      $scope.placesLoading = false;
      $scope.googlePlaces = places;

      console.log("Google places", $scope.googlePlaces);
    });

    $scope.showPhotos();
  }

  $scope.showPhotos = function() {
    console.log("renderPhotos");
    $scope.activeTab = 'photos';
    $scope.title = "Instagram photos";
    return false;
  }

  $scope.showFlickrPhotos = function() {
    console.log("renderFlickrPhotos");
    $scope.activeTab = 'flickr';
    $scope.title = "Flickr photos";
    return false;
  }

  $scope.showPhotosFromLocation = function(location) {
    console.log(location);
    InstagramService.getImagesByLocationId(location.id, function(photos) {
      $scope.instagramPhotos = photos;
      $scope.resetPhotoPages();
      console.log("Instagram photos", $scope.instagramPhotos);
    });
  }

  $scope.showPlaces = function() {
    $scope.activeTab = 'google';
    $scope.title = "Places";
    return false;
  }

  $scope.getStaticMap = function(place) {
    return GoogleService.getStaticMap(place);
  }

  $scope.addPlace = function(place) {
    console.log("add place", place);
    PlacesService.addPlace(place);

    $scope.notification = "Place added";

    $scope.timeout = $timeout(function() {
      $scope.notification = null;
    }, 2000);

    return false;
  }

  $scope.init();

}]);