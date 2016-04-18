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
myApp.service('weatherService', ['$resource', function($resource) {
	this.city = 'San Jose, CA';

	this.getWeather = function(city, days) {
		var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
		return weatherResult = weatherAPI.get({ q: city, cnt: days, APPID: 'a46667762de09a024f3bd04dc9a695d2' });
	};

}]);

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

myApp.controller('forecastsController', ['$scope', 'weatherService', '$routeParams', function($scope, weatherService, $routeParams) {
	$scope.city = weatherService.city;
	$scope.days = $routeParams.days || 7;
	$scope.weatherResult = weatherService.getWeather($scope.city, $scope.days);

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