angular.module('admin', [ 'layout' ]).config(
	function($stateProvider, $routeProvider) {
		$stateProvider.state('admin', {
			abstract:true,
			parent: 'secure',
			url : "/admin",
			templateUrl : "admin/admin.html",
		}).state('admin.home', {
			url : "",
			templateUrl : "admin/admin.home.html",
		}).state('admin.userlist', {
			url : "/users",
			templateUrl : "admin/admin.userlist.html",
			controller: function( $scope, $rootScope, $http ){

				$http.get( 'api/user?company=' + $rootScope.company._id.$id ).success(function(response) {
					$scope.users = response;
				}).error(function(response) {
					$scope.users = null;
				});

				$http.get( 'api/permission?company=' + $rootScope.company._id.$id ).success(function(response) {
					$scope.permissions = response;
				}).error(function(response) {
					$scope.permissions = null;
				});
				
				$scope.changePermission = function(permission){
					
					if(permission.value == "owner"){
						permission.value = "user";
					} else {
						permission.value = "owner";
					}

					permission.user = permission.user.$id;
					permission.company = permission.company.$id;
					
					$http.put( 'api/permission/' + permission._id.$id, permission ).success(function(response) {
						//$state.transitionTo('admin.userlist', $stateParams);
						//console.log(response);
						permission.user = response.user;
						permission.company = response.company;
					}).error(function(response) {
						console.log(response);
					});
				}
				
			}
		}).state('admin.useredit', {
			url : "/users/:userid",
			templateUrl : "admin/admin.useredit.html",
			controller: function( $scope, $state, $stateParams, $http, $rootScope ){

				$http.get( 'api/user/' + $stateParams.userid ).success(function(response) {
					$scope.user = response;
				}).error(function(response) {
					$scope.user = {};
				});
				
				$scope.del = function(){
					$http['delete']( 'api/user/' + $scope.user._id.$id ).success(function(response) {
						$state.transitionTo('admin.userlist', $stateParams);
					}).error(function(response) {
						console.log(response);
					});
				}
				
				$scope.save = function(){
					if($scope.user._id){
						
						$http.put( 'api/user/' + $scope.user._id.$id, $scope.user ).success(function(response) {
							if($scope.user._id.$id == $rootScope.user._id.$id){
								$rootScope.user = $scope.user;
							}
							$state.transitionTo('admin.userlist', $stateParams);
						}).error(function(response) {
							console.log(response);
						});
						
					} else {
						
						// create user
						$http.post( 'api/user', $scope.user ).success(function(response) {
							
							var permission = { 
									user : response._id.$id,
									company : $rootScope.company._id.$id,
									value : "user"
							};
							
							// create permission for user + company
							$http.post( 'api/permission', permission ).success(function(response) {
								$state.transitionTo('admin.userlist', $stateParams);
							}).error(function(response) {
								console.log(response);
							});
						}).error(function(response) {
							console.log(response);
						});
						
					}
				}
				
				$scope.cancel = function(){
					$state.transitionTo('admin.userlist', $stateParams);
				}
				
			}
		});
	}
);
