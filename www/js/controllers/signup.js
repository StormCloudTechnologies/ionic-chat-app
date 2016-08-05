angular.module('Signup.controllers', [])

.controller('SignupCtrl', function($scope, $localstorage, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService, SocketService) {
  $ionicPlatform.ready(function(){
    try{
      var isslogin = $localstorage.get('isslogin');
      if(isslogin=="1" || isslogin==1){
        $state.go('home');
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
        SocketService.emit('create user', {
              phone: usernumber,
              username: username
        });
        SocketService.on('user created', function(msg){
          console.log("====msg====",msg);
            $ionicLoading.hide();
            if(msg) {
                console.log(msg);
                $localstorage.set('isslogin', "1");
                localStorageService.set('username', username);
                localStorageService.set('usernumber', usernumber);
                localStorageService.set('userDocId', msg._id);
                localStorageService.set('userdata', msg);
                $state.go('editprofile');
            }
        });
      };
     }catch(err){
      console.log(err.message);
    }
  });

})