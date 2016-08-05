angular.module('AddGroupList.controllers', [])

.controller('AddGroupListCtrl', function($scope, $ionicHistory, $rootScope, DB, $localstorage, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
  
     $rootScope.addList = [];
     $scope.usernumber = localStorageService.get('usernumber');
     $scope.userdata = localStorageService.get('userdata');
     
     
     $rootScope.addList.push($scope.userdata);
      $scope.Donelist = function(){
         console.log($rootScope.addList);
         $state.go('addgroup');
      }

      $scope.group_name = localStorage.getItem("groupName");
      
      $scope.addMember = function(Adduser, isCheck) {
          if(isCheck==true){
            $rootScope.addList.push(Adduser);
            $localstorage.set("adduser", "1");
          }
          if(isCheck==false){
            $rootScope.addList.pop(Adduser);
          }
          console.log( $rootScope.addList);
      };
    }catch(err){
      console.log(err.message);
    }
  });

});
