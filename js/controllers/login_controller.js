app.controller('LoginController', ['$scope', '$timeout' ,'$window', 'InstagramService', 'GoogleService', 'PlacesService',
  function ($scope, $timeout, $window, InstagramService, GoogleService, PlacesService) {

    $scope.username = "";
    $scope.password = "";

    $scope.init = function() {
    }

    $scope.init();



  }]);