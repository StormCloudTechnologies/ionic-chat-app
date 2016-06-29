angular.module('Login.controllers', [])

.controller('loginCtrl', function($scope, $ionicSlideBoxDelegate, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
      $scope.home_ctrl = {};
      $scope.home_ctrl.username = "";
      $scope.login = function(username, number){
        if(username==""){
          alert("Please Enter the User Name");
          return false;
        }
        if(number==""){
          alert("Please Enter the number");
          return false;
        }
        localStorageService.set('username', username);
        localStorageService.set('usernumber', number);
        APIService.setData({
            req_url: url_prefix + 'createUser',
            data: {
              phone: number,
              username: username
            }
        }).then(function(resp) {
            if(resp.data) {
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