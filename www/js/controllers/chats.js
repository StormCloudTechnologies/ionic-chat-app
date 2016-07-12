angular.module('Chats.controllers', [])

.controller('ChatsCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{

      
     }catch(err){
      console.log(err.message);
    }
  });

})