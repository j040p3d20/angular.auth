angular.module('layout', [ 'ui.state' ]).config(
	function($stateProvider, $routeProvider) {
		$stateProvider.state('layout', {
			abstract: true,
			url : "",
			views : {
				"layout" : {
					templateUrl : "layout/layout.html",
				},
			}
		});
	}
);
