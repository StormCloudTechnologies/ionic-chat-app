angular.module('Status.controllers', [])

.controller('StatusCtrl', function($scope, $ionicLoading, $localstorage, $ionicPlatform, $state, localStorageService, APIService, $ionicPopover, $localstorage, $rootScope) {
  $ionicPlatform.ready(function(){
    try{
    	$rootScope.userStatus = $localstorage.get("userStatus");
    	$scope.usernumber = localStorageService.get('usernumber');
    	$scope.userDocId = localStorageService.get('userDocId');
    	console.log($scope.userStatus);
    	$ionicPopover.fromTemplateUrl('templates/deletestatus.html', {
		    scope: $scope
		}).then(function(deletestatus) {
		    $scope.deletestatus = deletestatus;
		});
		$scope.openPopoverdeletestatus = function($event2) {
		    $scope.deletestatus.show($event2);
		};
		$scope.closePopoverdeletestatus = function() {
		    $scope.deletestatus.hide();
		};

		$scope.addstatus = function(newStatus){
			APIService.setData({
	            req_url: url_prefix + 'updateContact',
	            data: {id: $scope.userDocId,phone:$scope.usernumber, status: newStatus}
	        }).then(function(resp) {
	          console.log(resp);
	            if(resp.data) {
	              $rootScope.userStatus = resp.data.status;
	              $localstorage.set("userStatus", resp.data.status);
	              // $state.go('status');
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