MyGuideApp.service('InstagramService', ['$http', function($http) {

  this.access_token = "7927273.cb524b4.a3bb749a83f84512ac55892c5d1ee1f1";
  

  this.available = function() {
    return this.access_token != null;
  }

  this.getImagesByLatLng = function(lat, lng, distance, callback, limit) {
      var self = this;

      limit = typeof limit !== 'undefined' ? limit : 2;
      
      // Go to the instagram api and get the data
      var search_url = "https://api.instagram.com/v1/media/search?"
          + 'access_token=' + this.access_token
          + "&lat=" + lat
          + "&lng=" + lng
          //+ '&min_timestamp=' + Math.floor((Date.now() - 24*60*60*1000)/1000);
          + "&distance=" + distance
          + '&callback=JSON_CALLBACK';

      console.log(search_url);

      $http.jsonp(search_url).
      success(function(data, status, headers, config) {
        console.log("Instagram photos, success",data,status);

        // Initialize the collection of images
        var images = data.data;

        //console.log("Images uploaded from location", images);

        // Get all places nearby
        //TODO: Determine of the place is in large city and calculate distance accordingly
        self.getPlacesByLatLng(lat,lng, 500, function(places) {
          if (!places || !places.length) 
            callback(images);

          async.each(places, function(place, _callback) {
            console.log("Load images from location", place.name);
            self.getImagesByLocationId(place.id, function(imagesByLocation) {
              
              // TODO: Add annotation for filtering
              
              images = images.concat(imagesByLocation);
              _callback();
            });
          }, function(err) {
            if(err) {
              console.log("There was an error" + err);
            } else {
              console.log("Loaded isntagram images from all locations", images.length, images);

              // TODO: Add retry if not enough
              images = _.sortBy(images, function(image) {return -image.created_time});

              callback(images);
            }
          });
        })
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
      });
  }

  this.getImagesByLocationId = function(locationId, callback) {
    // Go to the instagram api and get the data
    var search_url = "https://api.instagram.com/v1/locations/"
        + locationId
        + '/media/recent?'
        + 'access_token=' + this.access_token
        //+ '&min_timestamp=' + Math.floor((Date.now() - 24*60*60*1000)/1000);
        + '&callback=JSON_CALLBACK';

    console.log(search_url);

    $http.jsonp(search_url).
      success(function(data, status, headers, config) {
        callback(data.data);
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
      });
  }

  this.getPlacesByLatLng = function(lat, lng, distance, callback) {
    // Go to the instagram api and get the data
    var search_url = "https://api.instagram.com/v1/locations/search?"
        + 'access_token=' + this.access_token
        + "&lat=" + lat
        + "&lng=" + lng
        + "&distance=" + distance
        + '&callback=JSON_CALLBACK';

    console.log(search_url);

    $http.jsonp(search_url).
      success(function(data, status, headers, config) {
        console.log("Instgram places, success", data,status);
        callback(data.data);
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
      });
  }
}]);