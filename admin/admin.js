angular.module('admin', [ 'layout', 'ui.state' ]).config(
	function($stateProvider, $routeProvider) {
		$stateProvider.state('admin', {
			parent: 'secure',
			url : "/admin",
			templateUrl : "admin/admin.html",
		});
	}
);
