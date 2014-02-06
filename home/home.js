angular.module('home', [ 'layout' ]).config(
	function($stateProvider, $routeProvider) {
		$stateProvider.state('home', {
			parent: 'secure',
			url : "",
			templateUrl : "home/home.html",
		});
	}
);
