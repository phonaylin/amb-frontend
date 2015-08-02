'use strict';

var ambBusApp = angular.module('ambBusApp', ['ngRoute', 'ambApp', 'ui.bootstrap', 'busControllers']);

//configure our routes
ambBusApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'components/bus-search.html',
            controller  : 'BusSearchCtrl'
        })

        .when('/routes', {
            templateUrl : 'components/bus-route-list.html',
            controller  : 'BusRouteListCtrl'
        })

        // route for the about page
        .when('/routes/:routeId', {
            templateUrl : 'components/bus-route-detail.html',
            controller  : 'BusRouteDetailCtrl'
        })

        .otherwise({
        	redirectTo: '/'
        });
}]);

var busControllers = angular.module('busControllers', []);

busControllers.controller('BusSearchCtrl', ['$scope', '$http',
  function ($scope, $http) {

    $scope.dateFormats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.dateFormat = $scope.dateFormats[1];

    $scope.poiList = [
      {
        "id": 1,
        "createdDate": null,
        "modifiedDate": null,
        "title": "Yangon",
        "description": "Yangon",
        "map": null
      },
      {
        "id": 2,
        "createdDate": null,
        "modifiedDate": null,
        "title": "Mandalay",
        "description": "Mandalay",
        "map": null
      },
      {
        "id": 3,
        "createdDate": null,
        "modifiedDate": null,
        "title": "Bagan",
        "description": "Bagan",
        "map": null
      }
    ];

    // $http.get('http://localhost:8080/bus/search/api/routes').success(function(data) {
    //   $scope.busRoutes = data;
    // })

    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
      [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];

    $scope.getDayClass = function(date, mode) {
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0,0,0,0);

        for (var i=0;i<$scope.events.length;i++){
          var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }

      return '';
    };
  }]);

busControllers.controller('BusRouteListCtrl', ['$scope', '$http',
  function ($scope, $http) {

    $http.get('http://localhost:8080/bus/search/api/routes').success(function(data) {
      $scope.busRoutes = data;
    })
  }]);

busControllers.controller('BusRouteDetailCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    $scope.routeId = $routeParams.routeId;

    $http.get('http://localhost:8080/bus/search/api/findByRoute?from=1&to=2').success(function(data) {
      $scope.busScheduleList = data;
    })
  }]);
