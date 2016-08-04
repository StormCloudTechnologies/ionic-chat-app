angular.module('AddGroupList.controllers', [])

.controller('AddGroupListCtrl', function($scope, $ionicHistory, $rootScope, DB, $localstorage, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
  
     $rootScope.addList = [];
     $scope.usernumber = localStorageService.get('usernumber');
     
     $rootScope.addList.push($scope.usernumber);

      $scope.Donelist = function(){
         console.log($rootScope.addList);
         $state.go('addgroup');
      }

      $scope.group_name = localStorage.getItem("groupName");
      
      $scope.addMember = function(phone, isCheck) {
          if(isCheck==true){
            $rootScope.addList.push(phone);
            localstorage.set("adduser", "1");
          }
          if(isCheck==false){
            $rootScope.addList.pop(phone);
          }
      };
    }catch(err){
      console.log(err.message);
    }
  });

});
