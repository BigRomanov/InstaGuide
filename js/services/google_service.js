app.service('GoogleService', ['$http', function($http) {

    this.geocoder = new google.maps.Geocoder;

    this.setService = function(service) {
      this.service = service;
    }

    function rad(x) {
        return x * Math.PI / 180;
    };

    function getDistance(lat1, lng1, lat2, lng2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = rad(lat2 - lat1);
      var dLong = rad(lng2 - lng1);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    };

    this.findPlacesByName = function(name, callback) {
      var service = new google.maps.places.AutocompleteService();
      service.getQueryPredictions({ input: name }, callback);
    }

    this.getLocationByLatLng = function(lat, lng, callback) {
      this.geocoder.geocode({'location': {lat:lat, lng:lng}}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var result = results[0];
        var city = "";
        var country = "";

        _.each(result.address_components, function(component) {
          console.log(component, component.types);
          if (component.types[0] == 'locality') {
            city = component.long_name;
          }
          else if (component.types[0] == 'country') {
            country = component.long_name;
          }
        });

        callback(null, {country:country, city:city});
      }
      else {
        callback(status, null);
      }
    });
    }

    this.getPlacesByLatLng = function(lat, lng, distance, callback) {
      var self = this;
      var point = new google.maps.LatLng(lat, lng);
      var request = {
        location: point,
        radius: 500
      };
      this.service.nearbySearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {

          console.log(results);

          // Sort results by distance from the point
          var sorted = _.sortBy(results, function(place) {
            return getDistance(lat, lng, place.geometry.location.k, place.geometry.location.D);
          })

          var filtered = _.filter(sorted, function(place) {
              return _.some(place.types, function(type) {
                return (type == "airport"          || 
                        type == "amusement_park"   ||
                        type == "cafe"             || 
                        type == "food"             || 
                        type == "bar"              || 
                        type == "lodging"          || 
                        type == "store"            || 
                        type == "clothing_store"   || 
                        type == "park"             || 
                        type == "musem"            || 
                        type == "church"           || 
                        type == "place_of_worship" || 
                        type == "car_rental"     );
              });
          });

          callback(filtered);
        }
      });
    }

    this.getStaticMap = function(place) {
      if (place)
        return "https://maps.googleapis.com/maps/api/staticmap?center=" +
          place.geometry.location.lat() + "," + place.geometry.location.lng() +
          "&markers=color:red%7C" + place.geometry.location.lat() + "," + place.geometry.location.lng() +
          "&zoom=17&size=180x120&maptype=roadmap";
      else 
        return "";
    }

    // Callback from the gallery
    this.getItemDetails = function(place, callback) {
      var self = this;
      console.log("Google, load details", place)
      var request = {
        placeId: place.place_id
      };

      this.service.getDetails(request, function(details, status) {
        console.log("got details", status);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          place.details = details;
          place.map = self.getStaticMap(place.details);
        }
        callback(place);
      });
    }
}]);