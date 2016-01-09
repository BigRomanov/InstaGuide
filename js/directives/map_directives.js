var getTemplate = function(search) {
  if (search)
    return '<input id="pac-input" class="controls" type="text" placeholder="Search Box"><div id="{{mapId}}"></div>';
  else
    return '<div id="{{mapId}}"></div>';
}

MyGuideApp.directive('googleMap', ['$timeout', '$compile', function($timeout, $compile) {
  return {
    restrict: 'E',
    scope: {
      place: '=?',
      mapId: '=',
      search: '=?',
      onClick: '&',
      onInit: "&onInit"
    },

    link: function(scope, element, attrs) {
      scope.markers = [];

      element.html(getTemplate(scope.search)).show();
      $compile(element.contents())(scope);

      scope.$watch("place", function(value) {
        var p = value || null;
        if (p) {
          scope.showPlaceOnMap(scope.place);
        }
      });

      scope.resetMarkers = function() {
        for (var i = 0, marker; marker = scope.markers[i]; i++) {
          marker.setMap(null);
        }
      }

      scope.clearMarkers = function() {
        scope.markers = [];
      }

      scope.createMap = function(lat,lng) {
        lat = lat ? lat : 32.0906563;
        lng = lng ? lng : 34.770148;

        var mapOptions = {
          center: new google.maps.LatLng(lat,lng),
          zoom: 16,
          mapTypeControl: false,
        };

        document.getElementById(scope.mapId).style.display = "block";
        scope.map = new google.maps.Map(document.getElementById(scope.mapId), mapOptions);
        scope.service = new google.maps.places.PlacesService(scope.map);
        scope.geocoder = new google.maps.Geocoder();

        scope.onClick({lat: lat,lng: lng});

        google.maps.event.addListener(scope.map, 'click', function(event) {
          scope.onClick({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          });
        });

        // Initialize the search box
        if (scope.search) {
          var input = (document.getElementById('pac-input'));
          scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

          var searchBox = new google.maps.places.SearchBox((input));



          google.maps.event.addListener(searchBox, 'places_changed', function() {
            var places = searchBox.getPlaces();
            console.log("places_changed", places);

            if (places.length == 0) {
              return;
            }

            scope.resetMarkers();

            var place = places[0];

            var image = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };


            var marker = new google.maps.Marker({
              map: scope.map,
              icon: image,
              title: place.name,
              position: place.geometry.location
            });

            scope.markers.push(marker);

            if (place.geometry.viewport) {
              scope.map.fitBounds(place.geometry.viewport);
            } else {
              var bounds = new google.maps.LatLngBounds();
              bounds.extend(place.geometry.location);
              scope.map.fitBounds(bounds);
            }
          });

          google.maps.event.addListener(scope.map, 'bounds_changed', function() {
            var bounds = scope.map.getBounds();
            searchBox.setBounds(bounds);
          });
        } // if scope.search
      }

      scope.initMap = function() {

        var lat = null,
          lng = null;

        console.log("Initializing map");

        // Check if geo location is enabled, and use it
        if (navigator.geolocation) {
          var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };

          navigator.geolocation.getCurrentPosition(function(position) { // success
              lat = position.coords.latitude;
              lng = position.coords.longitude;

              scope.createMap(lat,lng);

            },
            function() { // error
              console.log("Error, unable to get geolocation");
              scope.createMap(lat,lng);
            }, options);
        }

      }

      scope.setAllMap = function(map) {
        for (var i = 0; i < scope.markers.length; i++) {
          scope.markers[i].setMap(map);
        }
      }

      scope.showPlaceOnMap = function(place) {

        console.log("googleMap directive::showPlaceOnMap", place);
        // Clear previous markers
        scope.setAllMap(null);
        var marker = new google.maps.Marker({
          map: scope.map,
          place: {
            placeId: place.place_id,
            location: place.geometry.location
          }
        });

        // Add marker to the list so we can clear it later
        scope.markers.push(marker);

        google.maps.event.addListenerOnce(scope.map, 'idle', function() {
          google.maps.event.trigger(scope.map, 'resize');
        });

        // var bounds = new google.maps.LatLngBounds();
        // bounds.extend(place.geometry.location);
        // scope.map.fitBounds(bounds);
        scope.map.setCenter(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()));
        scope.map.setZoom(16);
        //google.maps.event.trigger(map, 'resize');

        //google.maps.event.addListenerOnce(scope.map, 'idle', function () { google.maps.event.trigger(scope.map, 'resize'); }); 
        //scope.map.setCenter(place.geometry.location);
      }

      scope.showLocationOnMap = function(lat, lng) {
        var location = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
          position: location,
          map: scope.map
        });

        scope.markers.push(marker);

        scope.map.setZoom(18);
        scope.map.setCenter(location);
      }

      scope.showAddressOnMap = function(address, callback) {
        console.log("Google Map directive::showAddressOnMap", address);
        scope.geocoder.geocode({
          'address': address
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log("Google Map directive::showAddressOnMap", results);
            scope.map.setCenter(results[0].geometry.location);

            scope.map.fitBounds(results[0].geometry.bounds);
            var marker = new google.maps.Marker({
              map: scope.map,
              position: results[0].geometry.location
            });

            scope.markers.push(marker);

            if (callback) {
              callback(results[0])
            }
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
            if (callback) {
              callback(null);
            }
          }
        });
      }

      $timeout(function() {
        scope.initMap();
      }, 3000);


      // Return map directive interface to the controller
      scope.onInit({
        interface: {
          showPlaceOnMap: scope.showPlaceOnMap,
            showAddressOnMap: scope.showAddressOnMap,
            showLocationOnMap: scope.showLocationOnMap,
            clearMarkers: scope.clearMarkers,
            resetMarkers: scope.resetMarkers
        },
      });

    },

    controller: ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    }]
  };
}]);