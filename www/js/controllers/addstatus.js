angular.module('AddStatus.controllers', [])

.controller('AddStatusCtrl', function($scope, $localstorage, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService,$rootScope) {
  $ionicPlatform.ready(function(){
    try{
      	$scope.usernumber = localStorageService.get('usernumber');
      	$scope.userDocId = localStorageService.get('userDocId');
      	$scope.user = {};
      	$scope.user.status = '';
      	$scope.addstatus = function(status){
      		$state.go('status');
      		APIService.setData({
	            req_url: url_prefix + 'updateContact',
	            data: {id: $scope.userDocId,phone:$scope.usernumber, status: status}
	        }).then(function(resp) {
	          console.log(resp);
	            if(resp.data) {
	              $localstorage.set("userStatus", resp.data.status);
                  $rootScope.userStatus = resp.data.status;
	              $scope.user.status = '';
	              $state.go('status');
	            }
	           },function(resp) {
	            console.log('error',resp);
	        });
      	}
    }catch(err){
      console.log(err.message);
    }
  });

})