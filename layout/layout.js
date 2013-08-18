angular.module('layout', [ 'ui.state' ]).config(
	function($stateProvider, $routeProvider) {
		$stateProvider.state('layout', {
			url : "",
			templateUrl : "layout/layout.html",
			controller: function($scope, $rootScope, $http, $stateParams){
				
				/*
				 * login
				 */
				$scope.login = function(){
					
					var credentials = {
							email: $scope.email,
							password: $scope.password
					};

					$http.post( 'api/login', credentials).success(function(response) {
						$rootScope.user = response.user;
						$rootScope.companies = response.companies;
						$rootScope.permissions = response.permissions;
					}).error(function(response) {
						$rootScope.user = null;
						$rootScope.companies = null;
						$rootScope.permissions = null;
					});
				};
				
				/*
				 * logout
				 */
				$scope.logout = function(){
					$http.post( 'api/logout', null).success(function(response) {
						$rootScope.user = null;
						$rootScope.companies = null;
						$rootScope.permissions = null;
						$rootScope.company = null;
					});
				};
				
				/*
				 * register
				 */
				$scope.register = function(){
					
					var user = {
							name: $scope.name,
							email: $scope.email,
							password: $scope.password
					};
					
					var company = {
							name: $scope.company,
					};
					
					var request = {
							user : user,
							company : company
					};
					
					$http.post( 'api/register', request).success(function(response) {
						console.log(response);
					}).error(function(response) {
						console.log(response);
						$rootScope.user = null;
					});
				};
				
				$scope.login();
				
			}
		}).state('secure', {
			abstract:true,
			parent: 'layout',
			url : "/:cid",
			templateUrl : "layout/secure.html",
			controller: function($scope, $rootScope, $http, $stateParams){

				$rootScope.company = null;
				for (var i in $rootScope.companies) {
					if( $rootScope.companies[i]._id.$id == $stateParams.cid ){
						$rootScope.company = $rootScope.companies[i];
					}
				}
			}
		});
	}
);
