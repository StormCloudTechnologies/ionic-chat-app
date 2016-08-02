angular.module('GroupView.controllers', [])

.controller('GroupViewCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{

    	$scope.groupList = JSON.parse(localStorage.getItem("groupList"));
    	$scope.usernumber = localStorageService.get('usernumber');
    	console.log($scope.groupList);
    	if($scope.groupList.admin_number==$scope.usernumber){
    		$scope.shouldShowDelete = true;
			$scope.listCanSwipe = true;
    	}else{
    		$scope.shouldShowDelete = false;
			$scope.listCanSwipe = false;
    	}
		
		$scope.deleteuser = function(userList){
		   var index = $scope.groupList.users.indexOf(userList);
		   console.log(index);
           $scope.groupList.users.splice(index,1);
           console.log($scope.groupList.users);
		}
		var gorupID = $scope.groupList._id;
		var usersLst = $scope.groupList.users;
		$scope.updateUserList = function(){
			console.log('done');
			APIService.setData({
                req_url: url_prefix + 'updateGroup',
                data: {id:gorupID, users: usersLst, user_number:$scope.usernumber}
            }).then(function(resp) {
            	console.log(resp);
                if(resp.data) {
                	console.log(resp.data);
                    $scope.groupList = resp.data;
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