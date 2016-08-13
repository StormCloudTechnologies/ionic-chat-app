angular.module('GroupView.controllers', [])

.controller('GroupViewCtrl', function($scope, $ionicModal, $rootScope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
      $scope.addUserlist = [];
      $scope.updateList = [];
      $scope.url_prefix1 = url_prefix_for_image;
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
		// var gorupID = $scope.groupList._id;
		// var usersLst = $scope.groupList.users;
    // console.log(usersLst);
		$scope.updateUserList = function(){
			console.log('done');
			APIService.setData({
          req_url: url_prefix + 'updateGroup',
          data: {id:$scope.groupList._id, users: $scope.groupList.users, user_number:$scope.usernumber}
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

     $ionicModal.fromTemplateUrl('templates/addgroupuser.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(addgroupuser) {
      $scope.addgroupuser = addgroupuser;
    });
    $scope.openModaladdgroupuser = function() {
      $scope.updateList = angular.copy($scope.groupList.users);
      $scope.addgroupuser.show();
      
    };
    $scope.closeModaladdgroupuser = function(value) {
      console.log(value);
      if(value=="2"){
        $scope.adduser();
      }
      $scope.addgroupuser.hide();
    };
   
   $scope.addMember = function(adduser, isCheck){
      if(isCheck==true){
        $scope.updateList.push(adduser);
      }
      if(isCheck==false){
        $scope.updateList.pop(adduser);
      }
      
      console.log($scope.updateList);
    };
   $scope.usernumber = localStorageService.get('usernumber');
   
   // $rootScope.addList.push($scope.usernumber);

   
    $scope.adduser = function(){
       console.log("add", $scope.updateList);
        APIService.setData({
            req_url: url_prefix + 'updateGroup',
            data: {id:$scope.groupList._id, users: $scope.updateList, user_number:$scope.usernumber}
        }).then(function(resp) {
          console.log(resp);
            if(resp.data) {
              localStorage.setItem("userList", JSON.stringify(resp.data));
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