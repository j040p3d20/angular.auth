	angular.module('layout', [ 'ui.state' ]).config(
	function($stateProvider, $routeProvider) {
		$stateProvider.state('layout', {
			abstract: true,
			url : "",
			views : {
				"layout" : {
					templateUrl : "layout/layout.html",
					controller: function($scope, $rootScope, $http){
						
						$scope.selectCompany = function(){
							$rootScope.company = null;
						},
						
						$scope.logout = function(){
							$http.post( 'api/logout', null).success(function(response) {
								$rootScope.user = null;
								$rootScope.companies = null;
								$rootScope.permissions = null;
								$rootScope.company = null;
							});
						};
						
					}
				},
				"login" : {
					templateUrl : "layout/login.html",
					controller: function($scope, $rootScope, $http){
						
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
							
							console.log( request );
							
							$http.post( 'api/register', request).success(function(response) {
								console.log(response);
								$rootScope.message = "registration successfull";
							}).error(function(response) {
								console.log(response);
								$rootScope.message = response;
								$rootScope.user = null;
							});
							
						};
						
					}
				},
				"companies" : {
					templateUrl : "layout/companies.html",
					controller: function($scope, $rootScope, $http){
						$scope.selectCompany = function(company){
							$rootScope.company = company;
							console.log(company);
						}
					}
				},
			}
		});
	}
);
