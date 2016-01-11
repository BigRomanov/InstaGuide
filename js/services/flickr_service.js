app.service('FlickrService', ['$http', function($http) {

  this.api_key = "a3e91cf712a7fc8b67aa0210eb0c6866";

  // Use flickr algorithm to construct image url from image data
  this.constructUrl = function(photo) {
    var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server +"/"+photo.id+"_"+photo.secret+".jpg";
    return url;
  }

  this.constructBuddyiconUrl = function(person) {
    if (person.iconserver > 0) {
      return "https://farm" + person.iconfarm + ".staticflickr.com/" + person.iconserver +"/buddyicons/"+person.nsid+".jpg";
    }
    else 
    {
      return "https://www.flickr.com/images/buddyicon.gif";
    }
  }

  // Callback from the gallery
  this.getItemDetails = function(item, _callback) {
    var self = this;
    console.log("Load flickr details for item", item, item.owner, item.place_id);

    async.parallel([
      function(callback) {
        self.getPlaceInfo(item.place_id, function(data) {
          console.log("Place data", data);
          callback(null, data.place);
        });
      }, 
      function(callback) {
        self.getPersonInfo(item.owner, function(data) {
          console.log("Person data", data);
          callback(null, data.person)
        });
      }
    ], function(err,results) {
      item.place = results[0];
      item.person = results[1];

      // Initialize few additional fields
      // TODO: Refactor with better abstraction between flickr model and mg_ model ????
      item.mg_user_img = self.constructBuddyiconUrl(item.person);

      if ('realname' in item.person && item.person.realname._content != '')
        item.mg_user_name = item.person.realname._content;
      else
        item.mg_user_name = item.person.username._content;

      item.mg_user_url = item.person.profileurl._content;
      _callback(item);
    });
  }

  // Retrieve available sizes for photo with specific id
  this.getSizes = function(photoId) {
    var api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes"
        + "&api_key="  + this.api_key
        + "&photo_id=" + photoId
        + "&format=json"
        + '&jsoncallback=JSON_CALLBACK';

      console.log(api_url);

      $http.jsonp(api_url).
      success(function(data, status, headers, config) {
        callback(data);
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
      });
  }

  this.getPlaceInfo = function(place_id, callback) {
    // Go to the instagram api and get the data
    var search_url = "https://api.flickr.com/services/rest/?method=flickr.places.getInfo"
      + "&api_key="  + this.api_key
      + "&place_id=" + place_id
      + "&format=json"
      + '&jsoncallback=JSON_CALLBACK';

    console.log(search_url);

    $http.jsonp(search_url).
      success(function(data, status, headers, config) {
        callback(data);
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
      });
  }

  this.getPersonInfo = function(user_id, callback) {
    // Go to the instagram api and get the data
    var search_url = "https://api.flickr.com/services/rest/?method=flickr.people.getInfo"
      + "&api_key="  + this.api_key
      + "&user_id=" + user_id
      + "&format=json"
      + '&jsoncallback=JSON_CALLBACK';

    console.log(search_url);

    $http.jsonp(search_url).
      success(function(data, status, headers, config) {
        callback(data);
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
      });
  }

  this.likeUser = function(item) {
    console.log("FlickrService::likeUser", item);
  }

  this.blockUser = function(item) {
    console.log("FlickrService::blockUser", item);
  }

  this.findPlacesByName = function(name, callback) {
    var search_url = "https://api.flickr.com/services/rest/?method=flickr.places.find"
      + "&api_key="  + this.api_key
      + "&query=" + name
      + "&format=json"
      + '&jsoncallback=JSON_CALLBACK';

    console.log("FlickrService::findPlacesByName", search_url);

    $http.jsonp(search_url).
      success(function(data, status, headers, config) {
        callback(data.places);
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
      });
  }

  this.getPlaceDetails = function(place, callback) {
    console.log("FlickrService::getPlaceDetails", place);
    var search_url = "https://api.flickr.com/services/rest/?method=flickr.places.getInfo"
      + "&api_key="  + this.api_key
      + "&place_id=" + place.place_id
      + "&format=json"
      + '&jsoncallback=JSON_CALLBACK';

    console.log("FlickrService::getPlaceDetails", search_url);

    $http.jsonp(search_url).
      success(function(data, status, headers, config) {
        callback(data);
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
      });
  }

  this.getImagesByPlaceId = function(place_id, callback) {
    console.log("FlickrService::getImagesByPlaceId", place_id);
    var search_url = "https://api.flickr.com/services/rest/?method=flickr.photos.search"
      + "&api_key="  + this.api_key
      + "&place_id=" + place_id
      + "&extras=date_upload,date_taken,owner_name,geo,tags,url_sq,url_m,"
      + "&format=json"
      + '&jsoncallback=JSON_CALLBACK';

    console.log("FlickrService::getImagesByPlaceId",search_url);

    $http.jsonp(search_url).
      success(function(data, status, headers, config) {
        console.log(data);
        callback(data.photos.photo);
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
      });
  }

  this.getPlacesByLatLng = function(lat, lng, callback) {
      
    var search_url = "https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon"
      + "&api_key="  + this.api_key
      + "&lat=" + lat
      + "&lon=" + lng
      + "&accuracy=16"
      + "&format=json"
      + '&jsoncallback=JSON_CALLBACK';

    console.log(search_url);

    $http.jsonp(search_url).
      success(function(data, status, headers, config) {
        console.log("FlickrService::getPlacesByLatLng", data, status);
        callback(data.places);
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
      });
  }

  this.getImagesByLatLng = function(lat, lng, callback) {
      
    var search_url = "https://api.flickr.com/services/rest/?method=flickr.photos.search"
      + "&api_key="  + this.api_key
      + "&lat=" + lat
      + "&lon=" + lng
      + "&radius=0.5"
      + "&extras=date_upload,date_taken,owner_name,geo,tags,url_sq,url_m,"
      + "&format=json"
      + '&jsoncallback=JSON_CALLBACK';

    console.log("FlickrService::getImagesByLatLng: url = " + search_url);

    $http.jsonp(search_url).
      success(function(data, status, headers, config) {
        var photos = data.photos.photo;
        _.each(photos, function(photo) {
          photo.mg_source = "flickr";
          photo.mg_thumb_view_url = photo.url_sq;
          photo.mg_details_view_url = photo.url_m;
          photo.mg_user_name = photo.username;
          photo.mg_user_url = photo.profileUrl;
          photo.mg_user_img = photo.profile_picture;
          photo.mg_latitude = photo.latitude;
          photo.mg_longitude = photo.longitude;
        });
        callback(null, photos);
      }).
      error(function(data, status, headers, config) {
        console.log("Error", data, status);
        callback(data, null);
      });
  }

  
}]);