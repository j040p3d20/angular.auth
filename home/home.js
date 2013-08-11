angular.module('home', [ 'layout', 'ui.state' ]).config(
	function($stateProvider, $routeProvider) {
		$stateProvider.state('home', {
			parent: 'layout',
			url : "",
			views : {
				"content" : {
					templateUrl : "home/home.html"
				}
			}
		});
	}
);
