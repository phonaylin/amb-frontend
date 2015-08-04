'use strict';

var ambBusApp = angular.module('ambBusApp', ['ngRoute', 'ambApp', 'ui.bootstrap', 'busControllers']);

ambBusApp.factory('ambBackend', function ($http) {
      var data = {};
      var url = "http://localhost:8080/bus/";
      var promise = $http.get(url + 'getUser?u=3', { cache: true }).then(function (response) {
                data = response.data;
            });
      return data;
    });

ambBusApp.factory('busOrder', ['$http', function busOrderFactory($http) {
  var busOrder = {};
  busOrder.offer = {};
  busOrder.quantity = null;
  busOrder.poiFromId = 2;
  busOrder.poiToId = null;
  busOrder.travelDt = null;
  busOrder.state = "draft";

  return busOrder;

}]);

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

        .when('/order', {
            templateUrl : 'components/bus-order.html',
            controller  : 'BusOrderCtrl'
        })

        .otherwise({
        	redirectTo: '/'
        });
}]);

var busControllers = angular.module('busControllers', []);

busControllers.controller('BusOrderCtrl', ['$scope', '$http', 'busOrder',
  function ($scope, $http, busOrder) {
    $scope.offer = busOrder.offer;
  }]);

busControllers.controller('BusSearchCtrl', ['$scope', '$http', '$window', 'busOrder',
  function ($scope, $http, $window, busOrder) {
    $scope.fromId = null;
    $scope.toId = null;
    $scope.quantity = null;
    $scope.busOffers = {};

    $scope.searchOffers = function() {
      $http.get('http://localhost:8080/bus/offers?from='+ $scope.fromId +'&to='+ $scope.toId +'&date=2015-08-02').success(function(data) {
        $scope.busOffers = data;
      })
    };

    $scope.chooseOffer =  function(offer) {
      busOrder.offer = offer;
      console.log("chosen offer is " + busOrder.offer.id);
    };

    $scope.dateFormats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.dateFormat = $scope.dateFormats[1];

    $scope.cities = $window.cities;
    console.log($scope.cities);
    


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
        "title": "Inle",
        "description": "Inle",
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
