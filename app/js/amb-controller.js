'use strict';

var ambApp = angular.module('ambApp', []);

ambApp.directive('ambNavbar', function() {
	  return {
		  restrict: 'E',
		  templateUrl : 'components/navbar.html'
	  };
	});

ambApp.directive('ambFooter', function() {
	  return {
		  restrict: 'E',
		  templateUrl : 'components/footer.html'
	  };
	});

ambApp.directive('ambFooterbottom', function() {
	  return {
		  restrict: 'E',
		  templateUrl : 'components/footer-bottom.html'
	  };
	});

// TEST controller
ambApp.controller('people', function($scope, $http) {
  $http.get('/people/1').success(function(data) {
    $scope.person = data;
  })
});
