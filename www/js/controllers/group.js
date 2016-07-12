angular.module('Group.controllers', [])

.controller('GroupCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
      $scope.group_details = {};
      $scope.next = function(name) {
          localStorage.setItem("groupName",name);
          $state.go('addgroup');
      };
     }catch(err){
      console.log(err.message);
    }
  });

})