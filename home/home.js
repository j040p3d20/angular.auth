angular.module('home', [ 'layout', 'ui.state' ]).config(
	function($stateProvider, $routeProvider) {
		$stateProvider.state('home', {
			parent: 'secure',
			url : "",
			templateUrl : "home/home.html",
		});
	}
);
