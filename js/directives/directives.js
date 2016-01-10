app.directive('folder', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      title: '=',
      open: '='
    },
    link: function (scope, element, attrs) {
    },
    templateUrl: "partials/folder.html"
  }
}]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                alert('image is loaded');
            });
        }
    };
});

app.directive('stopEvent', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.bind('click', function (e) {
        e.stopPropagation();
      });
    }
  };
});


app.directive('gallery', ['$timeout', 'startFromFilter', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      loading: '=',
      pageSize: '=?'
    },
    link: function (scope, element, attrs) {
      scope.pageSize = scope.pageSize? scope.pageSize : 16;
      scope.currentPage = 0;

      scope.detailsOpen = false;

      scope.$watch("currentPage", function (value) {
        console.log("Changed current page", scope.currentPage);
      });

      scope.$watch("items", function (value) {
        var val = value || null;            
        if (val) {
          scope.detailsOpen = false;
          scope.pages = scope.items ? Math.ceil(scope.items.length/scope.pageSize) : 0;
          scope.tabs = new Array(scope.pages); 
        }
      });

      scope.showDetails = function(item) {
        console.log("Current item", item);

        if (scope.cItem) 
          scope.cItem.detailsOpen = false;

        // For galleries with details per list item (like google gallary)
        item.detailsOpen = true;

        // For galleries with details per current item (like flickr gallery)
        scope.cItem = item;
        
        scope.detailsOpen = true;

        if (scope.itemService) {
          scope.loading = true;
          scope.itemService.getItemDetails(item, function(item) {
            //TODO: Create a proper adapter for each time of item in the gallery
            scope.tripService.resetMarkers();
            scope.tripService.showLocationOnMap(item.latitude, item.longitude);
            scope.loading = false;
          });
        }
      };

      scope.nextItem = function() {
        var index = scope.items.indexOf(scope.cItem);
        if (index < scope.items.length - 1) {
          scope.showDetails(scope.items[index + 1 ]);
        }
      }

      scope.prevItem = function() {
        var index = scope.items.indexOf(scope.cItem);
        if (index > 0) {
          scope.showDetails(scope.items[index -1]);
        }
      }

      scope.closeDetails = function() {
        scope.detailsOpen = false;
      }

    },
    templateUrl: function(tElement, tAttrs) {
      return tAttrs.templateUrl;
    },
    controller: function($scope, $element, $attrs, $injector) {
      // Get the service responsible for processing items from directive attribute
      if ($attrs.itemService)
        $scope.itemService = $injector.get($attrs.itemService);

      // Get the service responsible for trip management from directive attribute
      if ($attrs.tripService)
        $scope.tripService = $injector.get($attrs.tripService);
      
    }
  };
}]);

app.directive('place', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      place: '='
      // onClick: '&',
      // onInit : "&onInit"
    },
    link: function (scope, element, attrs) {
    },
    templateUrl: "partials/place.html"
  }
}]);


app.directive('trip', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      trip: '=',
      delete: '&',
      select: '&',
    },
    link: function (scope, element, attrs) {
      
    },
    templateUrl: "partials/trip.html",
    controller: function($scope, $element, $attrs, $injector, $mdDialog) {
      $scope.confirmDelete = function(ev) {
        console.log("confirmDelete");
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .title('Would you like to delete this trip?')
          .content('We will not delete your saved locations')
          .ariaLabel('Delete trip')
          .ok('Yes')
          .cancel('No, keep it')
          .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
          console.log("Trip will be deleted");
        }, function() {
          console.log("Trip will be kept");
        });
      };
    }
  }
}]);

app.directive('prediction', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      prediction: '='
    },
    link: function (scope, element, attrs) {
    },
    templateUrl: "partials/prediction.html"
  }
}]);
