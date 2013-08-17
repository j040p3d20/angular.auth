angular.module('layout', [ 'ui.state' ]).config(
	function($stateProvider, $routeProvider) {
		$stateProvider.state('layout', {
			url : "",
			templateUrl : "layout/layout.html",
			controller: function($scope, $rootScope, $http, $stateParams){
				$rootScope.login = function(){
					$rootScope.user = "joao";
				};
			}
		}).state('secure', {
			abstract:true,
			parent: 'layout',
			url : "/:cid",
			templateUrl : "layout/secure.html",
			controller: function($scope, $rootScope, $http, $stateParams){
				$rootScope.company = $stateParams.cid == "" ? null : $stateParams.cid;
			}
		});
	}
);
