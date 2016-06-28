angular.module('Login.controllers', [])

.controller('loginCtrl', function($scope, $ionicSlideBoxDelegate, $ionicPlatform, $state, localStorageService) {
  $ionicPlatform.ready(function(){
    try{
      $scope.home_ctrl = {};
      $scope.home_ctrl.username = "";
      $scope.login = function(username){
        if(username==""){
          alert("Please Enter the number");
          return false;
        }
        localStorageService.set('username', username);
        $state.go('rooms');
      };
     }catch(err){
      console.log(err.message);
    }
  });

})