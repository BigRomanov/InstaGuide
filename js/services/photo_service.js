MyGuideApp.service('PhotoService', ['$http', 'FlickrService', function($http, FlickrService) {
  // Callback from the gallery
  this.getItemDetails = function(item, _callback) {
    // Get item details with matching provider
    if (item.mg_source == "flickr") {
      FlickrService.getItemDetails(item, _callback);
    }
    else {
      // nothing to resolve
      _callback(item);
    }
  };

});