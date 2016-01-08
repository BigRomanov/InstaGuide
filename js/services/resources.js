MyGuideApp.factory("Trip", function($resource) {
  return $resource("http://myguidemvc.azurewebsites.net/api/trips/:id");
});