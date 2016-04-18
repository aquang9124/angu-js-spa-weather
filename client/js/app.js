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
		.otherwise({
			redirectTo: '/'
		});
	});

// Services
myApp.service('weatherService', function() {
	var self = this;
	this.city = 'San Jose';
});

// Controllers
myApp.controller('inputsController', ['$scope', 'weatherService', function($scope, weatherService) {
	$scope.city = weatherService.city;

	$scope.$watch('city', function() {
		weatherService.city = $scope.city;
	});

}]);

myApp.controller('forecastsController', ['$scope', 'weatherService', '$resource', function($scope, weatherService, $resource) {
	$scope.city = weatherService.city;

	$scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
	$scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, APPID: 'a46667762de09a024f3bd04dc9a695d2' });
	
	$scope.convertToFahrenheit = function(degK) {
		return Math.round((1.8 * (degK - 273)) + 32);
	}

	$scope.convertToDate = function(dt) {
		return new Date(dt * 1000);
	}
}]);