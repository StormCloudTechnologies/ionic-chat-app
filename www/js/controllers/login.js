angular.module('Login.controllers', [])

.controller('loginCtrl', function($scope, $ionicSlideBoxDelegate, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
      $scope.home_ctrl = {};
      $scope.home_ctrl.username = "";
      $scope.home_ctrl.number = "";
      $scope.login = function(){
        var username =  $scope.home_ctrl.username;
        var usernumber =  $scope.home_ctrl.usernumber;
        if(username==""){
          alert("Please Enter the User Name");
          return false;
        }
        if(usernumber==""){
          alert("Please Enter the number");
          return false;
        }
        APIService.setData({
            req_url: url_prefix + 'createUser',
            data: {
              phone: usernumber,
              username: username
            }
        }).then(function(resp) {
            if(resp.data) {
                localStorageService.set('username', username);
                localStorageService.set('usernumber', usernumber);
                $state.go('rooms');
            }
           },function(resp) {
              // This block execute in case of error.
        });
      };
     }catch(err){
      console.log(err.message);
    }
  });

})