angular.module('Login.controllers', [])

.controller('LoginCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
      var isslogin = localStorageService.get('isslogin');
      if(isslogin=="1" || isslogin==1){
        $state.go('rooms');
      }
      $scope.loginform = {};
      $scope.loginform.username = "";
      $scope.loginform.number = "";

      $scope.gotologin = function(){
        var username =  $scope.loginform.username;
        var usernumber =  $scope.loginform.usernumber;
        if(username==""){
          alert("Please Enter the User Name");
          return false;
        }
        if(usernumber==""){
          alert("Please Enter the number");
          return false;
        }
        $ionicLoading.show({
          template: '<ion-spinner icon="ripple" class="spinner-assertive"></ion-spinner>'
        });
        APIService.setData({
            req_url: url_prefix + 'createUser',
            data: {
              phone: usernumber,
              username: username
            }
        }).then(function(resp) {
             $ionicLoading.hide();
            if(resp.data) {
                localStorageService.set('isslogin', "1");
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