angular.module('RoomView.controllers', [])

.controller('RoomViewCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
    	$scope.userchat=JSON.parse(localStorage.getItem("userchat"));
      console.log($scope.userchat);
      $scope.userName = $scope.userchat.phone;
      $scope.userStatus = $scope.userchat.status;
        $scope.url_prefix1 = 'http://52.36.75.89:9992/';
        // $scope.url_prefix1 = 'http://52.36.75.89:9992/';
      
     }catch(err){
      console.log(err.message);
    }
  });

})