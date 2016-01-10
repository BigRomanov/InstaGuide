app.controller('DiscoverController', ['$scope', '$timeout', '$window', '$location', '$routeParams', 
    'TripService', 'InstagramService', 'GoogleService', 'FlickrService', 'PhotoService',
  function($scope, $timeout, $window, $location, $routeParams, TripService, InstagramService, GoogleService, FlickrService, PhotoService) {

    // Data models
    $scope.photos = [];
    $scope.places = [];

    $scope.photosLoading = false;
    $scope.placesLoading = false;

    var ARTICLE_TAB = 1;
    var FLIGHTS_TAB = 2;
    var PHOTOS_TAB = 3;
    var PLACES_TAB = 4;

    $scope.activeTab = PHOTOS_TAB;

    $scope.photos_title = "PHOTOS";
    $scope.places_title = "PLACES";

    // Method to extract the instgram access token from url
    // TODO: Think what to do with this
    // $scope.getAccessToken = function(url) {
    //   var t = url;
    //   var r = t.replace(/.*access_token=/, '');
    //   console.log(r);
    //   return r;
    // }

    // $scope.instagramAvailable = function() {
    //   return InstagramService.available();
    // }

    // $scope.connectToInstagram = function() {
    //   var client_id = "cb524b4cb7ee4ccfb04c319c721ec59c";
    //   window.location.assign("https://instagram.com/oauth/authorize/?client_id=cb524b4cb7ee4ccfb04c319c721ec59c&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Ftoken?&response_type=token");
    // }

    $scope.init = function() {

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
        $timeout(function() {
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

      TripService.showLocationOnMap = function(lat, lng) {
        console.log("TripService.showLocationOnMap", lat, lng);
        $scope.mapInterface.showLocationOnMap(lat, lng);
      }

      TripService.clearMarkers = function() {
        console.log("TripService.clearMarkers");
        $scope.mapInterface.clearMarkers();
      }

      TripService.resetMarkers = function() {
        console.log("TripService.resetMarkers");
        $scope.mapInterface.resetMarkers();
      }

      $scope.showPhotos();
    }

    $scope.showAddressOnMap = function(address) {
      console.log("showAddressOnMap", address);
      $scope.mapInterface.showAddressOnMap(address);
    }

    // Callback from map directive which assigns map interface for future use
    $scope.mapCallback = function(interface) {
      $scope.mapInterface = interface;
    }

    // Hanndles click on map and loads information regarding the clicked location
    $scope.onMapClick = function(lat, lng) {
      console.log("DiscoverController::onMapClick, Map clicked", lat, lng);
      if (!lat || !lng) return;

      TripService.saveLocation(lat, lng);

      // Should we have only one loading? Looks ugly
      $scope.photosLoading = true;
      $scope.placesLoading = true;

      // Load photos from flickr and instagram
      async.parallel([
          function(callback) {
            InstagramService.getImagesByLatLng(lat, lng, function(err, photos) {
              callback(err, photos);
            });
          },
          function(callback) {
            FlickrService.getImagesByLatLng(lat, lng, function(err, photos) {
              callback(err, photos)
            });
          }
        ],
        function(err, results) {
          $scope.photosLoading = false;
          $scope.photos = results[0].concat(results[1]);
          $scope.photos_title = "PHOTOS (" + $scope.photos.length + ")";
          console.log("DiscoverController::onMapClick, loaded: " + $scope.photos.length + " photos from location", lat, lng);
        });

      GoogleService.getPlacesByLatLng(lat, lng, distance, function(places) {
        $scope.placesLoading = false;
        $scope.googlePlaces = places;
      });

      //$scope.showPhotos();
    }

    $scope.showArticles = function() {
      console.log("DiscoverController:showArticles");
      $scope.activeTab = ARTICLES_TAB;
      $scope.title = "ARTICLES";
    }

    $scope.showFlights = function() {
      console.log("DiscoverController:showFlights");
      $scope.activeTab = FLIGHTS_TAB;
      $scope.title = "FLIGHTS";
    }

    $scope.showPhotos = function() {
      console.log("DiscoverController:showPhotos");
      $scope.activeTab = PHOTOS_TAB;
      $scope.title = $scope.photos_title;
    }

    $scope.showPlaces = function() {
      console.log("DiscoverController:showPlaces");
      $scope.activeTab = PLACES_TAB;
      $scope.title = $scope.places_title;
    }

    // TODO: Add hotels or airbnb

    $scope.showPhotosFromLocation = function(location) {
      console.log(location);
      InstagramService.getImagesByLocationId(location.id, function(photos) {
        $scope.instagramPhotos = photos;
        $scope.resetPhotoPages();
        console.log("Instagram photos", $scope.instagramPhotos);
      });
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

  }
]);