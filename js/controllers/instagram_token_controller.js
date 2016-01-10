app.controller('InstagramTokenController', ['$scope', '$timeout' ,'$window', '$location', 'InstagramService',
  function ($scope, $timeout, $window, $location, InstagramService) {


    $scope.init = function() {

      console.log("InstagramTokenController", $routeParams, $location);
    }

    $scope.init();



  }]);