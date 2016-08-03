angular.module('GroupView.controllers', [])

.controller('GroupViewCtrl', function($scope, $rootScope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
      $scope.addUserlist = [];
      $scope.url_prefix1 = 'http://52.36.75.89:9992/';
        // $scope.url_prefix1 = 'http://192.168.0.103:9992/';
    	$scope.groupList = JSON.parse(localStorage.getItem("groupList"));
    	$scope.usernumber = localStorageService.get('usernumber');

      console.log($scope.groupList);
    	if($scope.groupList.admin_number==$scope.usernumber){
    		$scope.shouldShowDelete = true;
        $scope.Admin = false;
		   	$scope.listCanSwipe = true;
    	}else{
    	 	$scope.shouldShowDelete = false;
        $scope.Admin = true;
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
            localStorage.setItem("userList", JSON.stringify(resp.data));
              $scope.groupList = resp.data;
          }
         },function(resp) {
          console.log('error',resp);
      });
		}
    // $scope.adduser = function(){
    //   if( $scope.Addusercheck=="1"){
    //     APIService.setData({
    //         req_url: url_prefix + 'updateGroup',
    //         data: {id:gorupID, users: $scope.addUserlist, user_number:$scope.usernumber}
    //     }).then(function(resp) {
    //       console.log(resp);
    //         if(resp.data) {
    //           $localstorage.set("adduser", "0")
    //           console.log(resp.data);
    //           $scope.groupList = resp.data[0].users;
    //         }
    //        },function(resp) {
    //         console.log('error',resp);
    //     });
    //   }
    // }

      
     }catch(err){
      console.log(err.message);
    }
  });

})