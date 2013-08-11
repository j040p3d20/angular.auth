angular.module('admin', [ 'layout', 'ui.state' ]).config(
	function($stateProvider, $routeProvider) {
		$stateProvider.state('admin', {
			parent: 'layout',
			url : "/admin",
			views : {
				"content" : {
					templateUrl : "admin/admin.html"
				}
			}
		});
	}
);
