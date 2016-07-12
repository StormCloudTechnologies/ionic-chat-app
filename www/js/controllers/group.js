angular.module('Group.controllers', [])

.controller('GroupCtrl', function($scope, $localstorage, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
      $scope.group_details = {};
      $scope.next = function(name) {
          localStorage.setItem("groupName",name);
          $state.go('addgroup');
      };
    	$scope.groupform = {};
    	$scope.groupform.groupname = "";
      	$scope.addGorupName = function(){
      		var groupName = $scope.groupform.groupname;
      		if(groupName!=''){
      		  $localstorage.set("groupname", groupName);
      		  $state.go('addgroup');
      		}
      	}
      	$scope.backgroup = function(){
      		$localstorage.set("addlistgroup", "");
      		$state.go('home');
      	}

     }catch(err){
      console.log(err.message);
    }
  });

})