app.controller('AdminController', ['$scope', '$timeout' ,'$window', '$location', 'TripService', 'GoogleService', 'FlickrService',
  function ($scope, $timeout, $window, $location, TripService, GoogleService,FlickrService) {

    $scope.searchPlace = function() {
      console.log("Search for: ", $scope.name, $scope.lat, $scope.lng);

      // Reset previously resolved locations
      

      if ($scope.name) {
        // Search place by name on Google
        $scope.googleLoading = true;
        $scope.googlePlace = null;
        $scope.flickrImages =null;
        $scope.status = null;

        $scope.googleDetailsTitle = "Choose what you meant";
        
        GoogleService.findPlacesByName($scope.name, function(places, status) {
          if (status != google.maps.places.PlacesServiceStatus.OK) {
            console.log(status);
            if (status == 'ZERO_RESULTS')
              $scope.status = "No places found";
            else
              $scope.status = "Error: " + status;
          }
          else {
            console.log("Loaded google places " + places.length + " places", places);
            $scope.googlePlaces = places;
          }
          $scope.googleLoading = false;
          $scope.$apply();
        });
      }
    }

    $scope.resolveGooglePlace = function(place) {
      console.log("resolveGooglePlace", place);

      $scope.googlePlaces = null;
      $scope.googleLoading = true;

      // Find place on Google
      GoogleService.getPlaceDetails(place, function(placeDetails) {
        console.log("Resolved place on google", placeDetails);
        $scope.googlePlace = placeDetails;
        $scope.googleLoading = false;

        $scope.googleDetailsTitle = "Google details for: " + placeDetails.description 
           + " (" + placeDetails.details.geometry.location.lat() + "," + placeDetails.details.geometry.location.lng() + ")";

        FlickrService.getImagesByLatLng(placeDetails.details.geometry.location.lat(), placeDetails.details.geometry.location.lng(), function(images) {
          $scope.flickrImagesTitle = "Flickr images for location: " + "(" + placeDetails.details.geometry.location.lat() + "," + placeDetails.details.geometry.location.lng() + ")";
          $scope.flickrImages = images;
          
        });
      });
    }

    // $scope.resolveFlickrPlace = function(place) {
    //   console.log("resolveGooglePlace", place);

    //   $scope.flickrPlaces = null;
    //   $scope.flickrLoading = true;

    //   // Find place on Flickr
    //   FlickrService.getPlaceDetails(place, function(placeDetails) {
    //     console.log("Resolved place on flickr", placeDetails);
    //     $scope.flickrPlace = placeDetails.place;

    //     FlickrService.getImagesByPlaceId(placeDetails.place.place_id, function(images) {
    //       $scope.flickrImages = images;
    //       $scope.flickrLoading = false;  
    //     })

        
    //   });
    // }

    $scope.init = function() {
      $scope.status = null;
      $scope.googlePlaces = null;
      $scope.googlePlace = null;
      $scope.googleLoading = false;
      $scope.googleDetailsTitle = "Google Details";
      $scope.flickrImagesTitle = "Flickr Images";


      googlePlacesService = new google.maps.places.PlacesService($("#attributions").get(0));
      GoogleService.setService(googlePlacesService);
    }

    $scope.init();

  }]);