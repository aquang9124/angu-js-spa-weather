// Module
var myApp = angular.module('myApp', ['ngRoute', 'ngResource']);

	myApp.config(function($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'partials/home.html',
			controller: 'inputsController'
		})
		.when('/forecast', {
			templateUrl: 'partials/forecast.html',
			controller: 'forecastsController'
		})
		.when('/forecast/:days', {
			templateUrl: 'partials/forecast.html',
			controller: 'forecastsController'
		})
		.otherwise({
			redirectTo: '/'
		});
	});

// Services
myApp.service('weatherService', function() {
	var self = this;
	this.city = 'San Jose, CA';
});

// Controllers
myApp.controller('inputsController', ['$scope', 'weatherService', '$location', function($scope, weatherService, $location) {
	$scope.city = weatherService.city;

	$scope.$watch('city', function() {
		weatherService.city = $scope.city;
	});

	$scope.submit = function() {
		$location.path('/forecast');
	};

}]);

myApp.controller('forecastsController', ['$scope', 'weatherService', '$resource', '$routeParams', function($scope, weatherService, $resource, $routeParams) {
	$scope.city = weatherService.city;
	$scope.days = $routeParams.days || 7;
	$scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
	$scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days, APPID: 'a46667762de09a024f3bd04dc9a695d2' });
	
	$scope.convertToFahrenheit = function(degK) {
		return Math.round((1.8 * (degK - 273)) + 32);
	};

	$scope.convertToDate = function(dt) {
		return new Date(dt * 1000);
	};
}]);

// Custom Directives
myApp.directive('wspaPanel', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/weatherpanel.html',
		replace: true,
		scope: {
			weatherDayObj: "=",
			convertToStandard: "&",
			convertToDate: "&",
			dateFormat: "@"
		}
	};
});